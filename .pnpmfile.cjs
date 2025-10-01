module.exports = {
  hooks: {
    readPackage(pkg) {
      // Allow build scripts for these trusted packages
      if (pkg.name === '@tailwindcss/oxide' || pkg.name === 'esbuild') {
        pkg.scripts = pkg.scripts || {};
      }
      return pkg;
    }
  }
};