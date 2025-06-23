fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const categories = data.categories;
    const categoryContainer = document.getElementById('categories');
    const servicesContainer = document.getElementById('services');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');

    let activeCategory = categories[0].name;

    function renderCategories() {
      categoryContainer.innerHTML = categories
        .map(cat => `
          <button class="text-base font-medium snap-center px-3 py-1.5 rounded-md whitespace-nowrap ${cat.name === activeCategory ? 'bg-[#fbede0]' : ''}" data-category="${cat.name}">
            ${cat.name}
          </button>
        `)
        .join('');
    }

    function renderServices(categoryName) {
      const category = categories.find(cat => cat.name === categoryName);
      servicesContainer.innerHTML = category.services
        .map(service => `
          <div class="bg-transparent backdrop-blur-[6px] rounded-lg p-3 flex items-start space-x-3 cursor-pointer border border-[#e1dedb]/50" data-service="${service.title}">
            <img src="${service.icon}" alt="${service.title}" class="w-6 h-6">
            <div>
              <h3 class="font-semibold text-sm">${service.title}</h3>
              <p class="text-xs">${service.description}</p>
            </div>
          </div>
        `)
        .join('');
    }

    function renderModal(service) {
      modalTitle.textContent = service.title;
      modalContent.innerHTML = service.details
        ? Object.entries(service.details)
            .map(([section, items]) => `
              <div class="mb-3">
                <h4 class="font-medium text-sm">${section}</h4>
                <ul class="list-disc pl-4 text-xs">
                  ${Object.entries(items)
                    .map(([key, value]) => `<li>${key}: ${value}</li>`)
                    .join('')}
                </ul>
              </div>
            `)
            .join('')
        : 'Нет подробной информации';
      modal.classList.remove('hidden');
    }

    function filterServices(query) {
      const category = categories.find(cat => cat.name === activeCategory);
      servicesContainer.innerHTML = category.services
        .filter(service => 
          service.title.toLowerCase().includes(query.toLowerCase()) || 
          service.description.toLowerCase().includes(query.toLowerCase())
        )
        .map(service => `
          <div class="bg-transparent backdrop-blur-[6px] rounded-lg p-3 flex items-start space-x-3 cursor-pointer border border-[#e1dedb]/50" data-service="${service.title}">
            <img src="${service.icon}" alt="${service.title}" class="w-6 h-6">
            <div>
              <h3 class="font-semibold text-sm">${service.title}</h3>
              <p class="text-xs">${service.description}</p>
            </div>
          </div>
        `)
        .join('');
    }

    renderCategories();
    renderServices(activeCategory);

    categoryContainer.addEventListener('click', e => {
      const target = e.target.closest('[data-category]');
      if (target) {
        activeCategory = target.getAttribute('data-category');
        renderCategories();
        renderServices(activeCategory);
        searchInput.value = '';
      }
    });

    servicesContainer.addEventListener('click', e => {
      const target = e.target.closest('[data-service]');
      if (target) {
        const serviceTitle = target.getAttribute('data-service');
        const service = categories
          .find(cat => cat.name === activeCategory)
          .services.find(s => s.title === serviceTitle);
        renderModal(service);
      }
    });

    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    searchInput.addEventListener('input', e => {
      filterServices(e.target.value);
    });
  })
  .catch(error => console.error('Ошибка загрузки data.json:', error));
