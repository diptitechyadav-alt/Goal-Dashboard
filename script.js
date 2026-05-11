document.addEventListener("DOMContentLoaded", () => {
    updateStats(); // Page load hote hi check karega
    setInterval(updateStats, 2000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("current-date").innerText = new Date().toLocaleDateString('en-GB', options);

    // Har minute refresh taaki stats aur deadlines update rahein
    setInterval(updateStats, 60000);
    getTasks();
    updateProgressBar();
    setInterval(updateProgressBar, 60000); // Ye line zaroor check karein taaki tasks load ho skein
});
function addTask() {
    const input = document.getElementById("todo-input");
    const deadline = document.getElementById("deadline-input");
    const categoryInput = document.getElementById("category-input");

    // Check karein ki empty toh nahi hai
    if (!input.value.trim() || !deadline.value) {
        alert("Pehle Task aur Deadline bharo!");
        return;
    }

    const taskObj = {
        id: Date.now(),
        text: input.value,
        deadline: deadline.value,
        category: categoryInput.value, // Nayi Category yahan save hogi
        status: 'pending',
        completedAt: null
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Input clear karein
    input.value = "";
    deadline.value = "";
    
    // UI refresh karein taaki task turant dikhe
    if (typeof refreshUI === "function") {
        refreshUI();
    } else {
        getTasks(); 
    }
}

// 2. Task Screen Par Dikhane Ka Function (Safe & Clean Layout)
function createTaskElement(task) {
    let list = document.getElementById("todo-list");
    let li = document.createElement("li");
    const colors = { 'Coding': '#6366f1', 'College': '#a855f7', 'Personal': '#f59e0b', 'General': '#64748b' };
    const tagColor = colors[task.category] || '#64748b';
    let isMissed = new Date(task.deadline) < new Date() && task.status === 'pending';
   if (task.status === 'completed') {
            li.className = "task-item completed";
            li.style.borderLeft = "6px solid #22c55e"; // Green border
            li.style.background = "#ffffff";
        } else if (isMissed) {
            li.className = "task-item missed-deadline";
            li.style.borderLeft = "6px solid #ef4444"; // Red border
            li.style.background = "rgba(239, 68, 68, 0.05)"; // Light red tint
        } else {
            li.className = "task-item pending";
            li.style.borderLeft = `6px solid ${tagColor}`; // Tag color border
            li.style.background = "#ffffff";
        }

    li.innerHTML = `
        <span style="background: ${tagColor}15; color: ${tagColor}; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; display: inline-block; border: 1px solid ${tagColor}30;">
            ${task.category || 'General'}
        </span>
        <div class="task-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
            <span class="task-title" style="font-weight:700; font-size:18px; color:#1e293b;">${task.text}</span>
          ${task.status === 'completed' 
    ? '<span style="color:#22c55e; font-size:12px; font-weight:700;">✓ Successfully Completed</span>' 
    : (isMissed 
        ? '<span style="color:#ef4444; font-size:12px; font-weight:700;">⚠️ Deadline Missed</span>' 
        : '<span style="color:#f59e0b; font-size:12px; font-weight:700;">⏳ In Progress</span>'
      )
}  
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="time-info" style="font-size:12px; color:#64748b; line-height:1.5;">
                <p><i class="far fa-calendar-alt"></i> Deadline: ${new Date(task.deadline).toLocaleString()}</p>
                ${task.completedAt ? `<p style="color:#6366f1; font-weight:800; margin-top:5px;"><i class="fas fa-flag-checkered"></i> COMPLETED AT: ${task.completedAt}</p>` : ''}
            </div>
            <div class="btns">
                ${task.status === 'pending' ? `<i class="fas fa-check-circle" style="color:#22c55e; cursor:pointer; font-size:20px;" onclick="completeTask(${task.id})"></i>` : ''}
                <i class="fas fa-trash-alt" style="color:#94a3b8; cursor:pointer; font-size:20px; margin-left:15px;" onclick="removeTask(${task.id})"></i>
            </div>
      `; // Ye Line 81 par backtick aur semicolon hai

    list.appendChild(li);
}

// 3. Task Complete Karne Ka Function
function completeTask(id) {
    // Celebration Effect (Confetti)
    if(typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        // Sound play karne ka logic
const sound = document.getElementById('success-sound');
if(sound) {
    sound.currentTime = 0; // Har baar shuru se bajega
    sound.play();
}
    }

    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(t => {
        if(t.id === id) {
            t.status = 'completed';
            t.completedAt = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    refreshUI();
}

// 4. Task Delete Karne Ka Function
function removeTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")).filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    refreshUI();
    // 5. Motivational Quotes Data
const quotes = [
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Consistency is the key to mastery.", author: "Dipti's AI" },
    { text: "Small steps every day lead to big results.", author: "Anonymous" },
    { text: "Your only limit is your mind.", author: "Success Mindset" }
];

function displayRandomQuote() {
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    
    if (quoteText && quoteAuthor) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText.innerText = `"${randomQuote.text}"`;
        quoteAuthor.innerText = `- ${randomQuote.author}`;
    }
}

// Page load hone par quote dikhane ke liye
document.addEventListener("DOMContentLoaded", () => {
    displayRandomQuote();
    // Baki functions jo pehle se the wo yahan rehne dein
});
}

// 5. UI Refresh Function
function refreshUI() {
    document.getElementById("todo-list").innerHTML = "";
    getTasks();
    renderTasks(); // Ye line zaroor check karein taaki tasks load ho skein
    updateStats();
    updateProgressBar();
}
function getTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // Sirf ye niche wala 5-line ka logic badaliye
    tasks.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return -1;
        if (a.status !== 'completed' && b.status === 'completed') return 1;
        return b.id - a.id; 
    });

    document.getElementById("todo-list").innerHTML = "";
    tasks.forEach(task => createTaskElement(task));
    updateStats();
    updateProgressBar();
}
// 6. Stats Update (Today/Week/Month) - Corrected Version
function updateStats() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const now = new Date();
    const todayStr = now.toDateString();

    let d = 0, w = 0, m = 0;

    tasks.forEach(t => {
        const taskDate = new Date(t.deadline);
        const taskDateStr = taskDate.toDateString();
renderHeatmap(); // Heatmap ko yahan call karna taaki wo bhi update ho jaye
        // Today Check
        if (taskDateStr === todayStr) d++;

        // Week Check (Pichle 7 din)
        const diffTime = Math.abs(now - taskDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) w++;

        // Month Check (Pichle 30 din)
        if (diffDays <= 30) m++;
    });

    // Dashboard par numbers update karna
    if(document.getElementById('day-count')) document.getElementById('day-count').innerText = d;
    if(document.getElementById('week-count')) document.getElementById('week-count').innerText = w;
    if(document.getElementById('month-count')) document.getElementById('month-count').innerText = m;
}

// 7. Dark Mode Toggle
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

// 8. Filter Function
function filterTasks(range) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let now = new Date();
    let filtered = tasks.filter(t => {
        if (t.status !== 'completed') return false;
        let diffDays = (now - new Date(t.id)) / (1000 * 60 * 60 * 24);
        if (range === 'today') return new Date(t.id).toDateString() === now.toDateString();
        if (range === 'week') return diffDays <= 7;
        if (range === 'month') return diffDays <= 30;
        return true;
    });

    document.getElementById("todo-list").innerHTML = "";
    filtered.forEach(createTaskElement);
}
function updateProgressBar() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const textElement = document.getElementById("progress-text");
    const chartElement = document.getElementById("pie-chart");
    
    if (!textElement || !chartElement) return;

    if (tasks.length === 0) {
        textElement.innerText = "0%";
       chartElement.style.background = `conic-gradient(#6366f1 0deg, #e2e8f0 0deg)`; 
        return;
    }

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const percentage = Math.round((completedTasks / tasks.length) * 100);
    
    textElement.innerText = percentage + "%";
    // Pie chart update karne ke liye conic-gradient ka use
    chartElement.style.background = `conic-gradient(#6366f1 ${percentage * 3.6}deg, #e2e8f0 0deg)`;
}
function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completedTasks = tasks.filter(t => t.status === 'completed');

    // Pichle 7 dinon ka data dikhane ke liye
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toDateString();
        
        // Check karein ki us din kitne task poore hue
        const count = completedTasks.filter(t => {
            return new Date(t.id).toDateString() === dayStr; // t.id hum timestamp use kar rahe hain
        }).length;

        // Color intensity decide karein
        let opacity = count === 0 ? 0.1 : count * 0.3;
        if (opacity > 1) opacity = 1;

        const square = document.createElement('div');
        square.style.height = '20px';
        square.style.borderRadius = '5px';
        square.style.background = `rgba(99, 102, 241, ${opacity})`;
        square.title = `${dayStr}: ${count} tasks completed`;
        grid.appendChild(square);
    }
    
    document.getElementById('activity-status').innerText = completedTasks.length > 0 ? "KEEP THE STREAK ALIVE! ✨" : "START COMPLETING GOALS! 🚀";
}

// Ise updateStats function ke andar sabse niche call kar dijiye:
// renderHeatmap(); 