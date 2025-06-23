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
          <div class="bg-white/10 backdrop-blur-[6px] rounded-lg p-3 flex items-start space-x-3 cursor-pointer border border-[#e1dedb]/50" data-service="${service.title}">
            <svg class="w-6 h-6 text-[#383533]" fill="none" stroke="currentColor" viewBox="0 0 24 24">${service.icon}</svg>
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
      query = query.toLowerCase();
      let found = false;
      categories.forEach(cat => {
        const matchingServices = cat.services.filter(service => 
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          (service.details && Object.entries(service.details).some(([section, items]) =>
            section.toLowerCase().includes(query) ||
            Object.keys(items).some(key => key.toLowerCase().includes(query)) ||
            Object.values(items).some(value => value.toLowerCase().includes(query))
          ))
        );
        if (matchingServices.length > 0 && cat.name !== activeCategory) {
          activeCategory = cat.name;
          renderCategories();
          found = true;
        }
        if (cat.name === activeCategory) {
          servicesContainer.innerHTML = cat.services
            .filter(service => 
              service.title.toLowerCase().includes(query) ||
              service.description.toLowerCase().includes(query) ||
              (service.details && Object.entries(service.details).some(([section, items]) =>
                section.toLowerCase().includes(query) ||
                Object.keys(items).some(key => key.toLowerCase().includes(query)) ||
                Object.values(items).some(value => value.toLowerCase().includes(query))
              ))
            )
            .map(service => `
              <div class="bg-white/10 backdrop-blur-[6px] rounded-lg p-3 flex items-start space-x-3 cursor-pointer border border-[#e1dedb]/50" data-service="${service.title}">
                <svg class="w-6 h-6 text-[#383533]" fill="none" stroke="currentColor" viewBox="0 0 24 24">${service.icon}</svg>
                <div>
                  <h3 class="font-semibold text-sm">${service.title}</h3>
                  <p class="text-xs">${service.description}</p>
                </div>
              </div>
            `)
            .join('');
          // Открываем модалку, если найдено совпадение в details
          const service = cat.services.find(s => 
            s.details && Object.entries(s.details).some(([section, items]) =>
              section.toLowerCase().includes(query) ||
              Object.keys(items).some(key => key.toLowerCase().includes(query)) ||
              Object.values(items).some(value => value.toLowerCase().includes(query))
            )
          );
          if (service && query) {
            renderModal(service);
          }
        }
      });
      if (!found && query) {
        servicesContainer.innerHTML = '<p class="text-sm text-center">Ничего не найдено</p>';
      }
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
        modal.classList.add('hidden');
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
