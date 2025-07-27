/* eslint-disable @typescript-eslint/no-explicit-any */
// import prisma from '@/lib/db';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { PrismaClient } from '@/generated/prisma';
// import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();



// Type definitions based on the actual webhook payload
type EmailAddress = {
  email_address: string;
  id: string;
  linked_to: any[];
  object: 'email_address';
  verification: {
    status: string;
    strategy: string;
  };
};

type WebhookData = {
  birthday: string;
  created_at: number;
  email_addresses: EmailAddress[];
  external_accounts: any[];
  external_id: string;
  first_name: string;
  gender: string;
  id: string;
  image_url: string;
  last_name: string;
  last_sign_in_at: number;
  object: 'user';
  password_enabled: boolean;
  phone_numbers: any[];
  primary_email_address_id: string;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  private_metadata: Record<string, any>;
  profile_image_url: string;
  public_metadata: Record<string, any>;
  two_factor_enabled: boolean;
  unsafe_metadata: Record<string, any>;
  updated_at: number;
  username: string | null;
  web3_wallets: any[];
};

type SessionData = {
  id: string;
  user_id: string;
  status: string;
  last_active_at: number;
  expire_at: number;
  abandon_at: number;
  object: 'session';
};

type WebhookEvent = {
  data: WebhookData | SessionData;
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  object: 'event';
  timestamp: number;
  type: 'user.created' | 'user.updated' | 'user.deleted' ;
};

// Helper function to extract user details
const extractUserDetails = (data: WebhookData) => {
  const { 
    id, 
    email_addresses, 
    first_name, 
    last_name, 
    profile_image_url,
    created_at,
    updated_at,
    last_sign_in_at 
  } = data;

  return {
    id,
    email: email_addresses[0]?.email_address,
    firstName: first_name,
    lastName: last_name,
    profileImage: profile_image_url,
    createdAt: new Date(created_at).toISOString(),
    updatedAt: new Date(updated_at).toISOString(),
    lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at).toISOString() : null
  };
};

// Event handlers
const handleUserCreated = async (data: WebhookData) => {
  const userDetails = extractUserDetails(data);
  console.log('🎉 New user created:', userDetails);

  try {
    const user = await prisma.user.create({
      data: {
        role: 'CUSTOMER',
        clerkId: userDetails.id,
        email: userDetails.email,
        firstName: userDetails.firstName || null,
        lastName: userDetails.lastName || null,
        
        
      },
    });
    console.log('✅ User created in database:', user);
    return user;
  } catch (error) {
    console.error('❌ Error creating user in database:', error);
    throw error;
  }
};

const handleUserUpdated = async (data: WebhookData) => {
  const userDetails = extractUserDetails(data);
  console.log('📝 User updated:', userDetails);

  try {
    const user = await prisma.user.update({
      where: { clerkId: userDetails.id },
      data: {
        email: userDetails.email,
        firstName: userDetails.firstName || null,
        lastName: userDetails.lastName || null,
        updatedAt: new Date(userDetails.updatedAt)
      }
    });
    console.log('✅ User updated in database:', user);
    return user;
  } catch (error) {
    console.error('❌ Error updating user in database:', error);
    throw error;
  }
};

const handleUserDeleted = async (data: WebhookData) => {
  console.log('❌ User deleted:', { id: data.id });

  try {
    const user = await prisma.user.delete({
      where: { clerkId: data.id },
    });
    console.log('✅ User permanently deleted from database:', user);
    return user;
  } catch (error) {
    console.error('❌ Error deleting user from database:', error);
    throw error;
  }
};



export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as unknown as WebhookEvent;
    const { type, data } = evt;

    let result;
    
    // Handle different event types
    switch (type) {
      case 'user.created':
        result = await handleUserCreated(data as WebhookData);
        break;
      case 'user.updated':
        result = await handleUserUpdated(data as WebhookData);
        break;
      case 'user.deleted':
        result = await handleUserDeleted(data as WebhookData);
        break;
      
      default:
        console.log('⚠️ Unhandled event type:', type);
        return new Response('Unhandled event type', { status: 400 });
    }

   


    
   return Response.json(result)
  } catch (err) {
    console.error('❌ Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: 'Error processing webhook' }), 
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 