import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function run() {
  try {
    const email = process.env.TEST_USER_EMAIL || `test+${Date.now()}@example.com`;
    const password = process.env.TEST_USER_PASSWORD || `P@ssw0rd${Date.now()}`;

    console.log('Using test credentials:', email);

    // Try to sign in first
    let signIn = await supabase.auth.signInWithPassword({ email, password });
    if (signIn.error) {
      console.log('No existing user, attempting signUp...');
      const signUp = await supabase.auth.signUp({ email, password });
      if (signUp.error) {
        console.error('Signup failed:', signUp.error);
        // If signup requires email confirmation, abort and instruct user
        if (signUp.data?.user) {
          console.log('User created but no session (email confirmation may be required). Provide TEST_USER_EMAIL/TEST_USER_PASSWORD env or create user in dashboard.');
        }
        return;
      }
      if (!signUp.data?.session) {
        console.log('Signup succeeded but no session was returned (email confirmation likely required). Please create/confirm a test user in the Dashboard or set TEST_USER_EMAIL/TEST_USER_PASSWORD.');
        return;
      }
      signIn = signUp;
    }

    const session = signIn.data.session;
    if (!session) {
      console.error('Could not obtain session for test user. Aborting.');
      return;
    }

    // set session on client so subsequent requests include auth
    await supabase.auth.setSession(session);
    const uid = session.user.id;
    console.log('Authenticated test user id:', uid);

    const payload = {
      name: 'Auth Test Lead',
      email,
      phone: '+5511999999999',
      whatsapp: '+5511999999999',
      source: 'manual',
      funnel_stage: 'capturado',
      score: 1,
      owner_id: uid,
    };

    console.log('Inserting payload:', payload);
    const { data, error } = await supabase.from('leads').insert(payload).select();
    if (error) {
      console.error('Insert error:', error);
      return;
    }
    console.log('Insert success:', data);

    // cleanup created row
    if (data && data[0]) {
      await supabase.from('leads').delete().eq('id', data[0].id);
      console.log('Deleted created test row');
    }
  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

run();
