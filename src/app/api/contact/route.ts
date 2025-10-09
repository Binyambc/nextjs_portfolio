import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Drupal integration - try different endpoint formats
    const contactFormMachineName = 'website_contact';
    
    // Try the standard contact message endpoint first
    let drupalUrl = `${process.env.DRUPAL_BASE_URL || 'http://drupalportfolio.lndo.site'}/jsonapi/contact_message/${contactFormMachineName}`;
    
    let drupalResponse = await fetch(drupalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: `contact_message--${contactFormMachineName}`,
          attributes: {
            name: name,
            mail: email,
            subject: `Contact from ${name}`,
            message: message,
          }
        }
      })
    });

    // If that fails, try the generic contact_message endpoint
    if (!drupalResponse.ok && drupalResponse.status === 404) {
      drupalUrl = `${process.env.DRUPAL_BASE_URL || 'http://drupalportfolio.lndo.site'}/jsonapi/contact_message`;
      
      drupalResponse = await fetch(drupalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'contact_message--contact_message',
            attributes: {
              name: name,
              mail: email,
              subject: `Contact from ${name}`,
              message: message,
            }
          }
        })
      });
    }

    if (!drupalResponse.ok) {
      const errorText = await drupalResponse.text();
      return NextResponse.json(
        { error: `Failed to send message to Drupal. Status: ${drupalResponse.status}. Error: ${errorText}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully to Drupal!' },
      { status: 200 }
    );
  

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
