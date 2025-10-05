import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const drupalUrl = 'http://drupalportfolio.lndo.site';
    
    // Test 1: Check if JSON:API is working
    console.log('Testing JSON:API endpoint...');
    const jsonApiResponse = await fetch(`${drupalUrl}/jsonapi`);
    
    if (!jsonApiResponse.ok) {
      return NextResponse.json({
        error: 'JSON:API not accessible',
        status: jsonApiResponse.status,
        statusText: jsonApiResponse.statusText
      });
    }
    
    const jsonApiData = await jsonApiResponse.json();
    console.log('JSON:API response:', jsonApiData);
    
    // Test 2: Check available contact message endpoints
    console.log('Testing contact message endpoints...');
    const contactResponse = await fetch(`${drupalUrl}/jsonapi/contact_message`);
    
    let contactData = null;
    if (contactResponse.ok) {
      contactData = await contactResponse.json();
      console.log('Contact message endpoints:', contactData);
    } else {
      console.log('Contact message endpoint not accessible:', contactResponse.status);
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
    console.error('Drupal test error:', error);
    return NextResponse.json({
      error: 'Failed to test Drupal connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
