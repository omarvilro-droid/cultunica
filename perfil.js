// Tab functionality
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show selected tab content
            document.getElementById(tabName + '-tab').classList.remove('hidden');
            
            // Update tab button styles
            const tabButtons = document.querySelectorAll('.profile-tab');
            tabButtons.forEach(button => {
                button.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
                button.classList.add('text-gray-500');
            });
            
            // Highlight active tab
            event.target.classList.remove('text-gray-500');
            event.target.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
        }

        // Filter posts functionality
        function filterPosts(type) {
            const filters = document.querySelectorAll('.post-filter');
            filters.forEach(filter => {
                filter.classList.remove('bg-blue-600', 'text-white');
                filter.classList.add('bg-gray-100', 'text-gray-700');
            });
            
            event.target.classList.remove('bg-gray-100', 'text-gray-700');
            event.target.classList.add('bg-blue-600', 'text-white');
            
            console.log('Filtering posts by:', type);
            // Here you would implement the actual filtering logic
        }
// Subir y mostrar imagen de perfil
document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('upload-btn');
    const profileInput = document.getElementById('profile-input');
    const profilePicture = document.getElementById('profile-picture');

    uploadBtn.addEventListener('click', function() {
        profileInput.click();
    });

    profileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                profilePicture.style.backgroundImage = `url('${ev.target.result}')`;
                profilePicture.textContent = '';
                profilePicture.style.backgroundSize = 'cover';
                profilePicture.style.backgroundPosition = 'center';
            };
            reader.readAsDataURL(file);
            // Aquí podrías guardar la imagen en el servidor usando AJAX si tienes backend
        }
    });
});
        // Profile actions
        function editProfile() {
showTab('settings');
    // Opcional: puedes hacer scroll suave a la sección de configuración
    document.getElementById('settings-tab').scrollIntoView({ behavior: 'smooth' });
}        

        function goBack() {
         window.location.href = 'principal.html';      
      }

        // Add smooth scrolling and animations
        document.addEventListener('DOMContentLoaded', function() {
            // Add entrance animations
            const cards = document.querySelectorAll('.hover-lift');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });

        // Add interactive elements
        document.querySelectorAll('.stats-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }); 