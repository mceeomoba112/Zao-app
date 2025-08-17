console.log("ZAO APP script loaded!");

// ------------------- SUPABASE INIT -------------------
const supabaseUrl = 'https://rglmwgbbsbvgmpgqlrje.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbG13Z2Jic2J2Z21wZ3FscmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODY0MzEsImV4cCI6MjA3MDk2MjQzMX0.fTWdaVZ_oOuQ14TdjevpS5tUDFQagd0U6e9-HfzWFFs';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ------------------- DOM LOADED -------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded!");

  // Sign Up
  document.getElementById('signupBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("Signing up:", email);

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Sign Up Error: " + error.message);
    else alert('Check your email to verify your account!');
  });

  // Sign In
  document.getElementById('signinBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("Signing in:", email);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert("Sign In Error: " + error.message); return; }

    alert('Logged in!');
    document.getElementById('auth').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
    loadMessages();
  });

  // Auth State Change
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      console.log("User session detected:", session.user.email);
      document.getElementById('auth').style.display = 'none';
      document.getElementById('chat').style.display = 'block';
      loadMessages();
    }
  });

  // Send Message
  document.getElementById('sendBtn').addEventListener('click', async () => {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;
    const user = supabase.auth.user();
    if (!messageText || !user) return;

    await supabase.from('messages').insert([{ sender_id: user.id, message: messageText }]);
    messageInput.value = '';
    loadMessages();
  });
});

// ------------------- LOAD MESSAGES -------------------
async function loadMessages() {
  const { data: messages, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
  if (error) { console.log("Load Messages Error:", error); return; }

  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = '';
  messages.forEach(msg => messagesDiv.innerHTML += `<p><b>${msg.sender_id}:</b> ${msg.message}</p>`);
}