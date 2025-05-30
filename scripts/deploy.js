
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const deployChecklist = [
  {
    name: 'Environment Variables',
    check: () => {
      const envExample = path.join(process.cwd(), '.env.example');
      const env = path.join(process.cwd(), '.env');
      return fs.existsSync(envExample) || fs.existsSync(env);
    },
    fix: 'Create .env file with required environment variables'
  },
  {
    name: 'Build Configuration',
    check: () => {
      const viteConfig = path.join(process.cwd(), 'vite.config.ts');
      return fs.existsSync(viteConfig);
    },
    fix: 'Vite config should be properly configured'
  },
  {
    name: 'PWA Manifest',
    check: () => {
      const manifest = path.join(process.cwd(), 'public', 'manifest.json');
      return fs.existsSync(manifest);
    },
    fix: 'PWA manifest exists'
  },
  {
    name: 'Service Worker',
    check: () => {
      const sw = path.join(process.cwd(), 'public', 'sw.js');
      return fs.existsSync(sw);
    },
    fix: 'Service worker exists'
  }
];

console.log('🚀 Production Deployment Checklist\n');

let allPassed = true;

deployChecklist.forEach(({ name, check, fix }) => {
  const passed = check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  
  if (!passed) {
    console.log(`   → ${fix}\n`);
    allPassed = false;
  }
});

console.log('\n📋 Additional Deployment Considerations:');
console.log('• Test the app in production mode locally');
console.log('• Check bundle size and loading performance');
console.log('• Verify all external API keys are configured');
console.log('• Test offline functionality');
console.log('• Validate responsive design on multiple devices');
console.log('• Run security audit: npm audit');
console.log('• Test error boundaries and error handling');

if (allPassed) {
  console.log('\n🎉 All checks passed! Ready for deployment.');
} else {
  console.log('\n⚠️  Please address the issues above before deploying.');
  process.exit(1);
}
