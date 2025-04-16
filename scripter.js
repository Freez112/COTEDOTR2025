document.addEventListener('DOMContentLoaded', function() {
    // Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Form Elements
    const form = document.getElementById('analyseForm');
    const produitInitialInput = document.getElementById('produit_initial');
    const filsProduitInput = document.getElementById('fils_produit');
    const consommationEnergieInput = document.getElementById('consommation_energie');
    const rendementInput = document.getElementById('rendement');
    const consommationSpecifiqueInput = document.getElementById('consommation_specifique');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Calculate rendement
    function calculateRendement() {
        const produitInitial = parseFloat(produitInitialInput.value) || 0;
        const filsProduit = parseFloat(filsProduitInput.value) || 0;
        
        if (produitInitial > 0 && filsProduit > 0) {
            rendementInput.value = ((produitInitial / filsProduit) * 100).toFixed(2);
        } else {
            rendementInput.value = '';
        }
    }

    // Calculate consommation specifique
    function calculateConsommationSpecifique() {
        const consommationEnergie = parseFloat(consommationEnergieInput.value) || 0;
        const filsProduit = parseFloat(filsProduitInput.value) || 0;
        
        if (filsProduit > 0) {
            consommationSpecifiqueInput.value = (consommationEnergie / filsProduit).toFixed(2);
        } else {
            consommationSpecifiqueInput.value = '';
        }
    }

    // Event listeners for calculations
    produitInitialInput.addEventListener('input', calculateRendement);
    filsProduitInput.addEventListener('input', () => {
        calculateRendement();
        calculateConsommationSpecifique();
    });
    consommationEnergieInput.addEventListener('input', calculateConsommationSpecifique);

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/analyse/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                successMessage.textContent = result.message;
                successMessage.style.display = 'block';
                form.reset();
            } else {
                errorMessage.textContent = result.message || "Erreur lors de l'ajout de l'analyse";
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Erreur serveur';
            errorMessage.style.display = 'block';
            console.error(error);
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Apply saved theme
    htmlElement.setAttribute('data-theme', savedTheme);

    // Handle button click
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Additional animation
        if (newTheme === 'dark') {
            document.body.style.background = 'radial-gradient(circle at center, #2d3748 0%, #1a202c 100%)';
        } else {
            document.body.style.background = 'radial-gradient(circle at center, #f3f4f6 0%, #e5e7eb 100%)';
        }
    });

    // Animation on load if dark mode
    if (savedTheme === 'dark') {
        document.body.style.background = 'radial-gradient(circle at center, #2d3748 0%, #1a202c 100%)';
    }

    // Advanced Toggle
    const advancedToggle = document.getElementById('advancedToggle');
    const advancedFields = document.getElementById('advancedFields');

    advancedToggle.addEventListener('click', () => {
        advancedFields.style.display = advancedFields.style.display === 'none' ? 'block' : 'none';
        advancedToggle.classList.toggle('active');
    });

    // Button animation
    advancedToggle.addEventListener('mouseenter', () => {
        if (!advancedToggle.classList.contains('active')) {
            advancedToggle.style.transform = 'translateY(-2px)';
        }
    });

    advancedToggle.addEventListener('mouseleave', () => {
        advancedToggle.style.transform = '';
    });
});