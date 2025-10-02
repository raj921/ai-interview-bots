# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Installation (1 minute)
```bash
cd interview-assistant
npm install
```

### Step 2: Start the App (30 seconds)
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### Step 3: Test the Interview (2 minutes)

#### As a Candidate (Interviewee Tab)

1. **Upload Resume**
   - Click "Upload Resume" button
   - Select any PDF or DOCX file (or create one with the sample text below)
   - Wait for parsing to complete

2. **Provide Missing Info** (if prompted)
   - Fill in any missing fields (name, email, phone)
   - Click "Start Interview"

3. **Answer Questions**
   - Read the question
   - Watch the countdown timer
   - Type your answer
   - Click "Submit Answer"
   - Repeat for all 6 questions

4. **View Your Score**
   - See final score out of 100
   - Read AI-generated summary

#### As an Interviewer (Interviewer Tab)

1. **Switch to Interviewer Tab**
   - Click the "Interviewer" tab at the top

2. **View All Candidates**
   - See ranked list of candidates
   - Notice the trophy icon for top performer

3. **Search and Sort**
   - Try searching by name
   - Change sort order (score/name/date)

4. **View Details**
   - Click "View Details" on any candidate
   - Review complete interview transcript
   - See individual question scores
   - Read AI summary

## 📄 Create a Test Resume

Save this as a PDF or DOCX:

```
John Doe
Full Stack Developer

Email: john.doe@example.com
Phone: (555) 123-4567

Summary:
Experienced developer with 5 years in React and Node.js.

Skills:
- React, Redux, JavaScript, TypeScript
- Node.js, Express, MongoDB
- AWS, Docker, Git

Experience:
Senior Developer at TechCorp (2020-Present)
Built scalable web applications.

Education:
BS Computer Science, 2018
```

**Or use this minimal version (will prompt for phone):**

```
Jane Smith

jane.smith@email.com

Frontend Developer specializing in React.
```

## 💡 Quick Tips

### For Best Results:
- **Answer thoroughly**: More detailed answers get higher scores
- **Watch the timer**: It auto-submits when time runs out
- **Easy questions**: 20 seconds - quick answers okay
- **Medium questions**: 60 seconds - explain with examples
- **Hard questions**: 120 seconds - architectural thinking required

### Interview Score Guide:
- **80-100**: Excellent - Strong hire
- **60-79**: Good - Consider for interview
- **40-59**: Average - Needs improvement
- **0-39**: Poor - Not recommended

### Sample Good Answers:

**Easy Question**: "What is the difference between var, let, and const?"
```
var is function-scoped and can be redeclared. let is block-scoped 
and can be reassigned but not redeclared. const is also block-scoped 
but cannot be reassigned or redeclared. Modern best practice is to 
use const by default, let when reassignment is needed, and avoid var.
```

**Medium Question**: "Explain React hooks like useState and useEffect"
```
useState is a hook that allows functional components to have state. 
It returns an array with the current state value and a setter function. 
useEffect is used for side effects like data fetching, subscriptions, 
or manual DOM changes. It runs after render and can clean up with a 
return function. Both hooks must be called at the top level of 
components and follow the Rules of Hooks.
```

**Hard Question**: "Design a REST API for an e-commerce platform"
```
I would structure the API with these main resources:
- /api/products (GET, POST, PUT, DELETE) for product catalog
- /api/users (POST for registration, PUT for updates)
- /api/auth (POST for login/logout, JWT tokens)
- /api/cart (GET, POST, DELETE) for shopping cart
- /api/orders (GET, POST) for order processing
- /api/payments (POST) for payment processing

Use proper HTTP methods, status codes (200, 201, 400, 401, 404, 500).
Implement pagination for lists, authentication with JWT, rate limiting
for security, and versioning (/api/v1/). Use HTTPS in production,
validate all inputs, and implement proper error handling with 
consistent error response format.
```

## 🔧 Troubleshooting

### Resume not parsing?
- Make sure it's a PDF or DOCX
- Check that text is selectable (not an image)
- Try a simpler formatted resume

### Timer not working?
- Refresh the page
- Check browser console for errors
- Make sure JavaScript is enabled

### Data not saving?
- Check if localStorage is enabled
- Clear browser cache and try again
- Check if in private/incognito mode (some browsers restrict storage)

### Can't see candidates in dashboard?
- Make sure you completed the interview (all 6 questions)
- Check that you're on the "Interviewer" tab
- Try refreshing the page

## 🎯 Testing Checklist

Quick tests to verify everything works:

- [ ] Upload resume successfully
- [ ] Field extraction works (or prompts for missing)
- [ ] Interview starts with 6 questions
- [ ] Timer counts down
- [ ] Can submit answers
- [ ] Auto-submits on timeout
- [ ] Shows feedback after each answer
- [ ] Displays final score
- [ ] Candidate appears in dashboard
- [ ] Can view candidate details
- [ ] Search works
- [ ] Sort works
- [ ] Data persists after refresh

## 📚 Next Steps

1. **Read README.md** for full feature documentation
2. **Check PROJECT_STRUCTURE.md** to understand the code
3. **Review TESTING_GUIDE.md** for comprehensive testing
4. **See IMPLEMENTATION_SUMMARY.md** for technical details

## 🆘 Need Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| NPM install fails | Delete node_modules and package-lock.json, try again |
| Port 3000 in use | Stop other apps or use PORT=3001 npm start |
| Build fails | Check Node version (need 14+) |
| Resume parsing slow | Large PDFs take time, be patient |
| Timer jumps | Browser tab was inactive, this is expected |

## 🎉 Success!

If you can:
1. ✅ Upload a resume
2. ✅ Complete an interview
3. ✅ View the candidate in the dashboard

**You're all set!** The app is working correctly.

## 🚢 Ready to Deploy?

```bash
npm run build
```

Deploy the `build/` folder to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop the build folder
- **GitHub Pages**: Use gh-pages package
- **Any static host**: Upload build folder contents

---

**Estimated time to fully test**: 5-10 minutes

**Have fun interviewing! 🎤**
