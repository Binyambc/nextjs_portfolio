import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const drupalUrl = 'http://drupalportfolio.lndo.site';
    
    // Test 1: Check if JSON:API is working
    const jsonApiResponse = await fetch(`${drupalUrl}/jsonapi`);
    
    if (!jsonApiResponse.ok) {
      return NextResponse.json({
        error: 'JSON:API not accessible',
        status: jsonApiResponse.status,
        statusText: jsonApiResponse.statusText
      });
    }
    
    const jsonApiData = await jsonApiResponse.json();
    
    // Test 2: Check available contact message endpoints
    const contactResponse = await fetch(`${drupalUrl}/jsonapi/contact_message`);
    
    let contactData = null;
    if (contactResponse.ok) {
      contactData = await contactResponse.json();
    }
    
    return NextResponse.json({
      success: true,
      jsonApi: {
        accessible: true,
        data: jsonApiData
      },
      contactMessages: {
        accessible: contactResponse.ok,
        status: contactResponse.status,
        data: contactData
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test Drupal connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
