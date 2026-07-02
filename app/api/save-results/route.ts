import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { resumeData, scholarData, projects } = await req.json();

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
