const fs = require('fs');
const path = require('path');

const headerPath = 'C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/src/components/Header.jsx';
let header = fs.readFileSync(headerPath, 'utf8');

// 1. Add import AdminLoginModal
if (!header.includes('AdminLoginModal')) {
  header = header.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport AdminLoginModal from './AdminLoginModal';"
  );
  console.log('✓ Added AdminLoginModal import');
}

// 2. Add state inside Header component
const stateTarget = "const [wishlistCount] = useState(0);";
const stateReplace = `const [wishlistCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAdminActive = typeof window !== 'undefined' && localStorage.getItem('computercare_admin_auth') === 'true';`;

if (header.includes(stateTarget) && !header.includes('isAuthModalOpen')) {
  header = header.replace(stateTarget, stateReplace);
  console.log('✓ Added isAuthModalOpen & isAdminActive state');
}

// 3. Update the Login / Account button
const accountBtnTarget = `<button 
            type="button"
            onClick={() => setActiveTab('admin')}
            className="hidden sm:flex items-center gap-1.5 cursor-pointer group bg-transparent border-none p-0 text-left focus:outline-none flex-shrink-0"
          >
            <User className="w-[20px] h-[20px] xl:w-[22px] xl:h-[22px] text-slate-800 group-hover:text-blue-600 transition-colors stroke-[1.8]" />
            <div className="text-left select-none hidden lg:block">
              <span className="text-[10px] text-slate-500 block leading-tight">Login</span>
              <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block leading-tight">
                Account
              </span>
            </div>
          </button>`;

const accountBtnReplace = `<button 
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 cursor-pointer group bg-transparent border-none p-0 text-left focus:outline-none flex-shrink-0"
            title={isAdminActive ? "Admin Session Active - Click to Manage" : "Login to Account / Admin Portal"}
          >
            <div className="relative">
              <User className="w-[20px] h-[20px] xl:w-[22px] xl:h-[22px] text-slate-800 group-hover:text-blue-600 transition-colors stroke-[1.8]" />
              {isAdminActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>
            <div className="text-left select-none hidden lg:block">
              <span className={\`text-[10px] block leading-tight \${isAdminActive ? 'text-emerald-600 font-bold' : 'text-slate-500'}\`}>
                {isAdminActive ? 'Admin' : 'Login'}
              </span>
              <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block leading-tight">
                Account
              </span>
            </div>
          </button>`;

// Normalize CRLF for matching
header = header.replace(/\r\n/g, '\n');
const normalizedTarget = accountBtnTarget.replace(/\r\n/g, '\n');

if (header.includes(normalizedTarget)) {
  header = header.replace(normalizedTarget, accountBtnReplace);
  console.log('✓ Updated Login/Account button in desktop header');
} else {
  console.warn('✗ Account button target not matched directly, checking partial');
  header = header.replace(
    /onClick=\{\(\) => setActiveTab\('admin'\)\}\s*className="hidden sm:flex items-center gap-1\.5 cursor-pointer/,
    "onClick={() => setIsAuthModalOpen(true)}\n            className=\"hidden sm:flex items-center gap-1.5 cursor-pointer"
  );
  console.log('✓ Fallback regex replaced onClick to open modal');
}

// 4. Add modal render before </header>
const closingHeaderTarget = "</header>";
const modalSnippet = `
      {/* Admin / Account Login Modal */}
      <AdminLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessAdminLogin={() => {
          setActiveTab('admin');
          window.location.hash = 'admin';
        }}
      />
    </header>`;

if (!header.includes('<AdminLoginModal')) {
  header = header.replace(closingHeaderTarget, modalSnippet);
  console.log('✓ Added AdminLoginModal before </header>');
}

fs.writeFileSync(headerPath, header, 'utf8');
console.log('All Header.jsx updates written successfully.');
