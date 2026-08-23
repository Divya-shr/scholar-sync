export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeData, scholarData, projects } = body;

    if (!projects) {
      return NextResponse.json(
        { error: 'Missing projects data' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('results')
      .insert([
        {
          resume_data: resumeData || {},
          scholar_data: scholarData || {},
          project_suggestions: projects || [],
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('[SupabaseInsertError]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, savedData: data });
  } catch (err: any) {
    console.error('[SaveResultsError]', err);
    return NextResponse.json(
      { error: err.message || 'Failed to save results' },
      { status: 500 }
    );
  }
}