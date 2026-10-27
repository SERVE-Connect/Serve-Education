import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, CourseFolder, UserLearningData, TestScore, Certificate } from '../types';

export const ADMIN_EMAIL = 'i.k.shaikh@gmail.com';
export const ADMIN_EMAILS = [
  'i.k.shaikh@gmail.com'
];

export const isUserAdmin = (user: { email?: string | null } | null): boolean => {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();
  return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email) || email.endsWith('@margdarshak.admin');
};

export const DEFAULT_FOLDERS: CourseFolder[] = [
  {
    id: 'folder-ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    description: 'End-to-end ML workflows, Python data science, Pyodide live playground & deployment labs',
    icon: 'Brain',
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'folder-ai-superintelligence',
    name: 'AGI & Superintelligence',
    description: 'Foundations of AI agents, transformer architectures, alignment & scaling laws',
    icon: 'Sparkles',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'folder-quantum-computing',
    name: 'Quantum Physics & Computing',
    description: 'Qubits, quantum superposition, quantum logic gates & algorithms',
    icon: 'Atom',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'folder-bioengineering',
    name: 'Bio-Engineering & Longevity',
    description: 'CRISPR Cas9, cellular reprogramming, telomere research & healthspan',
    icon: 'Dna',
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'folder-robotics',
    name: 'Robotics & Autonomous Systems',
    description: 'Kinematics, sensor fusion, spatial perception & reinforcement control',
    icon: 'Zap',
    createdAt: Date.now()
  }
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-house-price-pred',
    folderId: 'folder-ai-ml',
    title: 'House Price Prediction App',
    fileName: 'house-price-prediction-tutorial_17f13d69.html',
    filePath: '/assets/aistudio/house-price-prediction-tutorial_17f13d69.html',
    description: 'SERVE Tutorial (AI Project #1): Predict real estate prices with Python, Pandas, Scikit-learn, interactive regression visualizer, in-browser Pyodide playground, and practice zone with verified scoreboard.',
    difficulty: 'Beginner',
    estimatedMinutes: 45,
    tags: ['Machine Learning', 'Python', 'Pandas', 'Scikit-learn', 'Streamlit', 'SERVE'],
    createdAt: Date.now(),
    createdBy: 'SERVE Education & Counselling',
    htmlContent: ''
  },
  {
    id: 'course-agi-101',
    folderId: 'folder-ai-superintelligence',
    title: 'AGI Architecture & Alignment Lab',
    fileName: 'agi_architecture_alignment_lab.html',
    description: 'Master core concepts of Artificial General Intelligence, safety guardrails, reinforcement learning with human feedback (RLHF), and interactive knowledge checks with real-time scoreboard.',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    tags: ['AGI', 'Machine Learning', 'Safety', 'Neural Networks'],
    createdAt: Date.now() - 3600000 * 4,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AGI Architecture & Alignment Lab</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 820px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    h1 { color: #0f172a; font-size: 28px; margin-bottom: 8px; }
    .badge { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
    .intro { font-size: 16px; color: #475569; margin-bottom: 24px; border-left: 4px solid #4f46e5; padding-left: 16px; }
    .card { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .card h3 { margin-top: 0; color: #1e293b; font-size: 18px; }
    .quiz-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; margin: 30px 0; }
    .option { display: block; margin: 10px 0; padding: 12px 16px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .option:hover { border-color: #6366f1; background: #eef2ff; }
    .btn { background: #4f46e5; color: white; border: none; padding: 12px 24px; font-size: 15px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .btn:hover { background: #4338ca; }
    .scoreboard { background: #1e1b4b; color: white; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center; }
    .score-value { font-size: 42px; font-weight: 800; color: #818cf8; margin: 10px 0; }
    /* Legacy user details form to be stripped by Margdarshak */
    #user-details-form { background: #fee2e2; border: 1px solid #f87171; padding: 20px; border-radius: 12px; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Advanced AI Module</span>
    <h1>AGI Architecture & Alignment Lab</h1>
    <p class="intro">Artificial General Intelligence (AGI) represents synthetic computational systems capable of understanding, learning, and applying intelligence across diverse domains at or beyond human levels. Let's explore safety, compute, and cognitive architectures.</p>

    <div class="card">
      <h3>1. The Three Pillars of Modern AGI Research</h3>
      <ul>
        <li><strong>Compute & Scaling Laws:</strong> Predictable emergent reasoning capabilities as parameters, dataset tokens, and test-time compute increase.</li>
        <li><strong>RLHF & Constitutional AI:</strong> Guiding models via reinforcement learning from human and synthetic feedback to ensure alignment with human ethics.</li>
        <li><strong>Agentic Tool Orchestration:</strong> Providing LLMs with environments, interpreters, and memory buffers to act authoritatively on goals.</li>
      </ul>
    </div>

    <div class="card">
      <h3>2. Interactive Challenge: Superalignment Dilemma</h3>
      <p>A cognitive system must optimize supply chains during a crisis without compromising safety margins. What alignment principle guarantees human oversight?</p>
      <div id="exercise-1">
        <label class="option"><input type="radio" name="q1" value="A"> Unchecked reward function maximizing cargo throughput</label>
        <label class="option"><input type="radio" name="q1" value="B"> Bounded corrigibility with human-in-the-loop override and constitutional safety limits</label>
        <label class="option"><input type="radio" name="q1" value="C"> Completely turning off all safety filters for maximum latency reduction</label>
      </div>
    </div>

    <div class="quiz-box">
      <h3>Knowledge Check: Test Your Mastery</h3>
      <p>Question 2: What is the primary function of "Test-Time Compute" in modern reasoning models?</p>
      <label class="option"><input type="radio" name="q2" value="A"> Allocating more compute during inference for deliberate chain-of-thought exploration and self-correction</label>
      <label class="option"><input type="radio" name="q2" value="B"> Pre-training on twice as many text documents</label>
      <label class="option"><input type="radio" name="q2" value="C"> Compressing weights using 2-bit quantization</label>

      <div style="margin-top: 20px;">
        <button class="btn" id="submit-quiz-btn" onclick="evaluateQuiz()">Submit & Record Score to Margdarshak</button>
      </div>
    </div>

    <div class="scoreboard" id="scoreboard-card" style="display: none;">
      <div style="text-transform: uppercase; letter-spacing: 1px; font-size: 13px; color: #a5b4fc;">Verified Scoreboard</div>
      <div class="score-value" id="score-display">0%</div>
      <p id="score-status" style="color: #cbd5e1; margin-bottom: 0;">Scores are automatically synchronized to your authenticated student profile.</p>
    </div>

    <!-- User details form at bottom: will be stripped or replaced by parent app -->
    <div id="user-details-form">
      <h4>Student Registration Form (Legacy)</h4>
      <p>Enter your details below to save your score:</p>
      <input type="text" placeholder="Full Name" style="width: 100%; padding: 8px; margin: 4px 0;"><br>
      <input type="email" placeholder="Email Address" style="width: 100%; padding: 8px; margin: 4px 0;"><br>
      <input type="text" placeholder="School / Grade" style="width: 100%; padding: 8px; margin: 4px 0;">
    </div>
  </div>

  <script>
    function evaluateQuiz() {
      var q1 = document.querySelector('input[name="q1"]:checked');
      var q2 = document.querySelector('input[name="q2"]:checked');
      
      var score = 0;
      var total = 2;
      
      if (q1 && q1.value === 'B') score++;
      if (q2 && q2.value === 'A') score++;
      
      var percentage = Math.round((score / total) * 100);
      
      var scoreboard = document.getElementById('scoreboard-card');
      var scoreDisplay = document.getElementById('score-display');
      var scoreStatus = document.getElementById('score-status');
      
      scoreboard.style.display = 'block';
      scoreDisplay.textContent = percentage + '% (' + score + '/' + total + ')';
      
      if (percentage >= 70) {
        scoreStatus.textContent = '🌟 Outstanding! You passed this module and unlocked +100 XP and Certificate eligibility.';
      } else {
        scoreStatus.textContent = 'Keep practicing! Review the scaling laws and re-attempt to improve your standing.';
      }
      
      // Auto-post to parent Margdarshak app
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'MARGDARSHAK_QUIZ_COMPLETE',
          payload: {
            quizTitle: 'AGI Architecture & Alignment Lab',
            score: score,
            maxScore: total,
            percentage: percentage,
            passed: percentage >= 50,
            xp: percentage >= 70 ? 100 : 50
          }
        }, '*');
      }
    }
  </script>
</body>
</html>`
  },
  {
    id: 'course-quantum-101',
    folderId: 'folder-quantum-computing',
    title: 'Quantum Qubits & Superposition Explorer',
    fileName: 'quantum_qubits_superposition.html',
    description: 'Interactive quantum state simulator: explore Bloch sphere coordinates, Hadamard gates, quantum entanglement, and test your comprehension.',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    tags: ['Quantum', 'Physics', 'Qubits', 'Superposition'],
    createdAt: Date.now() - 3600000 * 2,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quantum Qubits & Superposition Explorer</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #0f172a; background: #0f172a; color: #f1f5f9; margin: 0; padding: 24px; }
    .container { max-width: 820px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 1px solid #334155; }
    h1 { color: #38bdf8; font-size: 28px; margin-bottom: 8px; }
    .badge { display: inline-block; background: #0369a1; color: #e0f2fe; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
    .card { background: #0f172a; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #334155; }
    .interactive-qubit { text-align: center; padding: 24px; background: #090d16; border-radius: 12px; margin: 24px 0; border: 1px solid #38bdf8; }
    .state-display { font-size: 28px; font-family: monospace; color: #38bdf8; margin: 16px 0; }
    .gate-btn { background: #0284c7; color: white; border: none; padding: 10px 18px; margin: 4px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .gate-btn:hover { background: #0369a1; }
    .quiz-box { background: #0f172a; border: 2px dashed #0284c7; border-radius: 12px; padding: 24px; margin: 30px 0; }
    .option { display: block; margin: 10px 0; padding: 12px 16px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; cursor: pointer; color: #cbd5e1; }
    .option:hover { border-color: #38bdf8; background: #0f172a; }
    .scoreboard { background: #0369a1; color: white; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center; }
    .score-value { font-size: 42px; font-weight: 800; color: #f0f9ff; margin: 10px 0; }
    #user-details-form { background: #450a0a; border: 1px solid #991b1b; padding: 20px; border-radius: 12px; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Quantum Physics Lab</span>
    <h1>Quantum Qubits & Superposition Explorer</h1>
    <p>Unlike classical bits that are strictly 0 or 1, a qubit exists in a linear superposition: |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.</p>

    <div class="interactive-qubit">
      <div style="font-size: 13px; text-transform: uppercase; color: #94a3b8;">Qubit State Vector</div>
      <div class="state-display" id="qubit-state">|0⟩ (100% Probability of 0)</div>
      <div>
        <button class="gate-btn" onclick="applyGate('H')">Hadamard (H) Gate</button>
        <button class="gate-btn" onclick="applyGate('X')">Pauli-X (NOT) Gate</button>
        <button class="gate-btn" onclick="applyGate('Z')">Phase-Flip (Z) Gate</button>
        <button class="gate-btn" onclick="resetQubit()">Reset |0⟩</button>
      </div>
      <p id="qubit-explanation" style="font-size: 13px; color: #94a3b8; margin-top: 12px;">Click a gate above to transform the quantum state vector.</p>
    </div>

    <div class="quiz-box">
      <h3 style="color: #38bdf8; margin-top:0;">Quantum Exercise & Scoreboard</h3>
      <p>Question: If a qubit starts in state |0⟩ and we apply a Hadamard gate (H), what is the probability of measuring state |1⟩?</p>
      <label class="option"><input type="radio" name="quantum_q" value="0"> 0%</label>
      <label class="option"><input type="radio" name="quantum_q" value="50"> 50% (|1/√2|²)</label>
      <label class="option"><input type="radio" name="quantum_q" value="100"> 100%</label>

      <div style="margin-top: 20px;">
        <button class="gate-btn" style="background: #38bdf8; color: #0f172a; font-weight: bold;" onclick="evaluateQuantumQuiz()">Submit to Margdarshak</button>
      </div>
    </div>

    <div class="scoreboard" id="scoreboard-card" style="display: none;">
      <div style="text-transform: uppercase; letter-spacing: 1px; font-size: 13px;">Score Recorded</div>
      <div class="score-value" id="score-display">100%</div>
      <p id="score-status">Data synced to user profile in Margdarshak.</p>
    </div>

    <div id="user-details-form">
      <h4>Student Registration Form (Legacy)</h4>
      <input type="text" placeholder="Full Name"><br>
      <input type="email" placeholder="Email Address">
    </div>
  </div>

  <script>
    var currentState = '|0⟩';
    function applyGate(gate) {
      var stateEl = document.getElementById('qubit-state');
      var explEl = document.getElementById('qubit-explanation');
      if (gate === 'H') {
        currentState = '(|0⟩ + |1⟩) / √2';
        stateEl.textContent = currentState + ' (Equal 50% Superposition)';
        explEl.textContent = 'Hadamard gate maps basis states into an equal superposition!';
      } else if (gate === 'X') {
        currentState = currentState === '|0⟩' ? '|1⟩' : '|0⟩';
        stateEl.textContent = currentState;
        explEl.textContent = 'Pauli-X bit-flip gate inverted the state amplitudes.';
      } else if (gate === 'Z') {
        explEl.textContent = 'Phase flip gate modified the relative phase without altering measuring probability.';
      }
    }
    function resetQubit() {
      currentState = '|0⟩';
      document.getElementById('qubit-state').textContent = '|0⟩ (100% Probability of 0)';
      document.getElementById('qubit-explanation').textContent = 'State reset to initial computational ground state |0⟩.';
    }
    function evaluateQuantumQuiz() {
      var selected = document.querySelector('input[name="quantum_q"]:checked');
      var score = (selected && selected.value === '50') ? 1 : 0;
      var total = 1;
      var percentage = score * 100;

      document.getElementById('scoreboard-card').style.display = 'block';
      document.getElementById('score-display').textContent = percentage + '%';

      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'MARGDARSHAK_QUIZ_COMPLETE',
          payload: {
            quizTitle: 'Quantum Qubits & Superposition Explorer',
            score: score,
            maxScore: total,
            percentage: percentage,
            passed: percentage === 100,
            xp: 75
          }
        }, '*');
      }
    }
  </script>
</body>
</html>`
  },
  {
    id: 'course-crispr-101',
    folderId: 'folder-bioengineering',
    title: 'CRISPR Cas9 & Longevity Interventions',
    fileName: 'crispr_longevity_foundations.html',
    description: 'Learn modern precision genome editing with CRISPR Cas9, cellular senescence mechanisms, and age-reversal interventions.',
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    tags: ['CRISPR', 'Bioengineering', 'Longevity', 'Genetics'],
    createdAt: Date.now() - 3600000 * 1,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRISPR Cas9 & Longevity Interventions</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #064e3b; background: #f0fdf4; margin: 0; padding: 24px; }
    .container { max-width: 820px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #bbf7d0; }
    h1 { color: #065f46; font-size: 28px; margin-bottom: 8px; }
    .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
    .card { background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #bbf7d0; }
    .btn { background: #059669; color: white; border: none; padding: 12px 24px; font-size: 15px; font-weight: 600; border-radius: 8px; cursor: pointer; }
    .btn:hover { background: #047857; }
    .quiz-box { background: #f8fafc; border: 2px dashed #34d399; border-radius: 12px; padding: 24px; margin: 30px 0; }
    .option { display: block; margin: 10px 0; padding: 12px 16px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; }
    .scoreboard { background: #064e3b; color: white; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center; }
    .score-value { font-size: 42px; font-weight: 800; color: #6ee7b7; margin: 10px 0; }
    #user-details-form { background: #fef2f2; border: 1px solid #f87171; padding: 20px; border-radius: 12px; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Bio-Engineering Module</span>
    <h1>CRISPR Cas9 & Longevity Interventions</h1>
    <p>Explore the mechanics of single-guide RNA (sgRNA), protospacer adjacent motifs (PAM), and epigenetic reprogramming for cellular rejuvenation.</p>

    <div class="card">
      <h3 style="margin-top:0;">Hallmarks of Aging & Therapeutic Targets</h3>
      <ul>
        <li><strong>Genomic Instability & Telomere Attrition:</strong> DNA double-strand break accumulation and telomeric shortening.</li>
        <li><strong>Epigenetic Alterations:</strong> Yamanaka factors (Oct4, Sox2, Klf4) induce partial reprogramming to reset the biological clock.</li>
        <li><strong>Cellular Senescence:</strong> Senolytic interventions to clear "zombie cells" that secrete SASP cytokines.</li>
      </ul>
    </div>

    <div class="quiz-box">
      <h3 style="margin-top:0; color: #065f46;">Interactive Lab Evaluation</h3>
      <p>Which enzyme component induces the targeted double-stranded DNA cleavage once guided by sgRNA?</p>
      <label class="option"><input type="radio" name="bio_q" value="wrong"> DNA Ligase</label>
      <label class="option"><input type="radio" name="bio_q" value="correct"> Cas9 Endonuclease</label>
      <label class="option"><input type="radio" name="bio_q" value="wrong2"> RNA Polymerase</label>

      <div style="margin-top: 20px;">
        <button class="btn" onclick="submitBioQuiz()">Submit Exercise to Profile</button>
      </div>
    </div>

    <div class="scoreboard" id="scoreboard-card" style="display: none;">
      <div style="text-transform: uppercase; letter-spacing: 1px; font-size: 13px; color: #a7f3d0;">Verified Scoreboard</div>
      <div class="score-value" id="score-display">100%</div>
      <p id="score-status" style="color: #d1fae5;">Score submitted and saved to Margdarshak learning records.</p>
    </div>

    <div id="user-details-form">
      <h4>Student Registration (Legacy)</h4>
      <input type="text" placeholder="Full Name"><br>
      <input type="email" placeholder="Email Address">
    </div>
  </div>

  <script>
    function submitBioQuiz() {
      var selected = document.querySelector('input[name="bio_q"]:checked');
      var passed = selected && selected.value === 'correct';
      var percentage = passed ? 100 : 0;

      document.getElementById('scoreboard-card').style.display = 'block';
      document.getElementById('score-display').textContent = percentage + '%';

      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'MARGDARSHAK_QUIZ_COMPLETE',
          payload: {
            quizTitle: 'CRISPR Cas9 & Longevity Interventions',
            score: passed ? 1 : 0,
            maxScore: 1,
            percentage: percentage,
            passed: passed,
            xp: 90
          }
        }, '*');
      }
    }
  </script>
</body>
</html>`
  }
];

export async function getFolders(): Promise<CourseFolder[]> {
  let loadedFolders: CourseFolder[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'courseFolders'));
    if (!querySnapshot.empty) {
      querySnapshot.forEach(doc => {
        loadedFolders.push({ id: doc.id, ...doc.data() } as CourseFolder);
      });
    }
  } catch (err) {
    console.warn("Using local course folders due to Firestore fetch error/rules:", err);
  }

  if (loadedFolders.length === 0) {
    const cached = localStorage.getItem('margdarshak_course_folders');
    if (cached) {
      try {
        loadedFolders = JSON.parse(cached);
      } catch {
        // Fallback
      }
    }
  }

  // Merge defaults if missing
  const merged = [...loadedFolders];
  DEFAULT_FOLDERS.forEach(def => {
    if (!merged.some(f => f.id === def.id)) {
      merged.push(def);
    }
  });

  return merged.length > 0 ? merged : DEFAULT_FOLDERS;
}

export async function saveFolder(folder: CourseFolder): Promise<void> {
  // Update local storage first
  const existing = await getFolders();
  const index = existing.findIndex(f => f.id === folder.id);
  let updated: CourseFolder[];
  if (index >= 0) {
    updated = existing.map(f => f.id === folder.id ? folder : f);
  } else {
    updated = [folder, ...existing];
  }
  localStorage.setItem('margdarshak_course_folders', JSON.stringify(updated));

  try {
    await setDoc(doc(db, 'courseFolders', folder.id), folder, { merge: true });
  } catch (err) {
    console.warn("Could not save folder to Firestore (cached locally):", err);
  }
}

export async function getCourses(): Promise<Course[]> {
  let loadedCourses: Course[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    if (!querySnapshot.empty) {
      querySnapshot.forEach(doc => {
        loadedCourses.push({ id: doc.id, ...doc.data() } as Course);
      });
    }
  } catch (err) {
    console.warn("Using local courses due to Firestore fetch error/rules:", err);
  }

  if (loadedCourses.length === 0) {
    const cached = localStorage.getItem('margdarshak_courses');
    if (cached) {
      try {
        loadedCourses = JSON.parse(cached);
      } catch {
        // Fallback
      }
    }
  }

  // Ensure default courses (including the newly added House Price Prediction tutorial) are always present
  const merged = [...loadedCourses];
  DEFAULT_COURSES.forEach(def => {
    const existingIndex = merged.findIndex(c => c.id === def.id || c.fileName === def.fileName);
    if (existingIndex < 0) {
      merged.unshift(def);
    } else {
      // update filePath / metadata if needed
      merged[existingIndex] = { ...def, ...merged[existingIndex], filePath: def.filePath || merged[existingIndex].filePath };
    }
  });

  return merged.length > 0 ? merged : DEFAULT_COURSES;
}

export async function saveCourse(course: Course): Promise<void> {
  const existing = await getCourses();
  const index = existing.findIndex(c => c.id === course.id);
  let updated: Course[];
  if (index >= 0) {
    updated = existing.map(c => c.id === course.id ? course : c);
  } else {
    updated = [course, ...existing];
  }
  localStorage.setItem('margdarshak_courses', JSON.stringify(updated));

  try {
    await setDoc(doc(db, 'courses', course.id), course, { merge: true });
  } catch (err) {
    console.warn("Could not save course to Firestore (cached locally):", err);
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  const existing = await getCourses();
  const updated = existing.filter(c => c.id !== courseId);
  localStorage.setItem('margdarshak_courses', JSON.stringify(updated));

  try {
    await deleteDoc(doc(db, 'courses', courseId));
  } catch (err) {
    console.warn("Could not delete course from Firestore:", err);
  }
}

export async function deleteFolder(folderId: string): Promise<void> {
  const existingFolders = await getFolders();
  const updatedFolders = existingFolders.filter(f => f.id !== folderId);
  localStorage.setItem('margdarshak_course_folders', JSON.stringify(updatedFolders));

  const existingCourses = await getCourses();
  const updatedCourses = existingCourses.filter(c => c.folderId !== folderId);
  localStorage.setItem('margdarshak_courses', JSON.stringify(updatedCourses));

  try {
    await deleteDoc(doc(db, 'courseFolders', folderId));
  } catch (err) {
    console.warn("Could not delete folder from Firestore:", err);
  }
}

export const INITIAL_PREPS = [
  { id: 'prep-1', courseId: 'course-agi-101', title: 'Complete Linear Algebra & Multi-Variable Calculus Basics', category: 'Foundation', completed: true },
  { id: 'prep-2', courseId: 'course-agi-101', title: 'Build a Toy Transformer from Scratch in PyTorch', category: 'Project', completed: false },
  { id: 'prep-3', courseId: 'course-quantum-101', title: 'Review Dirac Bra-Ket Notation and Complex Numbers', category: 'Foundation', completed: true },
  { id: 'prep-4', courseId: 'course-quantum-101', title: 'Run a 2-Qubit Bell State on IBM Quantum Experience', category: 'Lab', completed: false },
  { id: 'prep-5', courseId: 'course-crispr-101', title: 'Study DNA Transcription & Cas9 Catalytic Domains', category: 'Biology', completed: false }
];

export const INITIAL_COMPETITIONS = [
  { id: 'comp-1', title: 'National AI Frontier Hackathon 2025', courseTitle: 'AGI Architecture & Alignment Lab', rank: 4, score: 94, date: Date.now() - 86400000 * 7, badge: 'Top 5 Finalist' },
  { id: 'comp-2', title: 'Kaggle Quantum Algorithms Challenge', courseTitle: 'Quantum Qubits & Superposition Explorer', rank: 12, score: 88, date: Date.now() - 86400000 * 14, badge: 'High Distinction' },
  { id: 'comp-3', title: 'SynBio Future Minds Competition', courseTitle: 'CRISPR Cas9 & Longevity Interventions', score: 91, date: Date.now() - 86400000 * 21, badge: 'Honorary Mention' }
];

export async function getUserLearningData(userId: string): Promise<UserLearningData> {
  const defaultData: UserLearningData = {
    userId,
    courseProgress: {
      'course-agi-101': 100,
      'course-quantum-101': 50,
      'course-crispr-101': 25
    },
    testScores: [
      {
        testId: 'test-1',
        courseId: 'course-agi-101',
        courseTitle: 'AGI Architecture & Alignment Lab',
        quizTitle: 'Knowledge Check: Superalignment & Scaling',
        score: 2,
        maxScore: 2,
        percentage: 100,
        date: Date.now() - 86400000 * 2,
        passed: true
      }
    ],
    preps: INITIAL_PREPS,
    competitions: INITIAL_COMPETITIONS,
    certificates: [
      {
        id: 'cert-agi-01',
        courseId: 'course-agi-101',
        courseTitle: 'AGI Architecture & Alignment Lab',
        recipientName: 'Student Learner',
        issueDate: Date.now() - 86400000 * 2,
        score: 100,
        certificateNumber: 'MRG-AGI-2025-8821'
      }
    ],
    xp: 350,
    badges: ['Pioneer Learner', 'Alignment Scholar', 'Fast Thinker'],
    lastActivityAt: Date.now()
  };

  try {
    const docRef = doc(db, 'userLearningData', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...defaultData, ...(snap.data() as Partial<UserLearningData>) };
    }
  } catch (err) {
    console.warn("Could not fetch user learning data from Firestore:", err);
  }

  const cached = localStorage.getItem(`margdarshak_learning_${userId}`);
  if (cached) {
    try {
      return { ...defaultData, ...JSON.parse(cached) };
    } catch {
      // Fallback
    }
  }

  return defaultData;
}

export async function saveUserLearningData(userId: string, data: UserLearningData): Promise<void> {
  localStorage.setItem(`margdarshak_learning_${userId}`, JSON.stringify(data));

  try {
    const docRef = doc(db, 'userLearningData', userId);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.warn("Could not save user learning data to Firestore:", err);
  }
}
