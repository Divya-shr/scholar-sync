export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client'; // or your supabase helper path

export async function POST(request: Request) {
  try {
    const { resumeData, scholarData, projects } = await request.json();

    if (!resumeData || !scholarData || !projects) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('results').insert({
      resume_data: resumeData,
      scholar_data: scholarData,
      project_suggestions: projects,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[SaveResultsError]', err);
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 });
  }
}
