const forbiddenCategories = [
    "아편", "코카인", "헤로인", "모르핀", "펜타닐", "암페타민", "권총", "소총", "도검",
    "음란물", "불법복제 소프트웨어", "북한 제품", "욱일기", "화약", "폭약"
  ];
  
  const categories = [];
  let selectedMainCategory = null;
  
  // DOM Elements
  const mainCategoryInput = document.getElementById('mainCategoryInput');
  const subCategoryInput = document.getElementById('subCategoryInput');
  const addMainCategoryButton = document.getElementById('addMainCategoryButton');
  const addSubCategoryButton = document.getElementById('addSubCategoryButton');
  const message = document.getElementById('message');
  const categoriesContainer = document.getElementById('categoriesContainer');
  const inquiryModal = document.getElementById('inquiryModal');
  const closeInquiryModal = document.getElementById('closeInquiryModal');
  const customerServiceButton = document.getElementById('customerServiceButton');
  const sendInquiryButton = document.getElementById('sendInquiryButton');
  const subCategoryModal = document.getElementById('subCategoryModal');
  const mainCategoryList = document.getElementById('mainCategoryList');
  const saveSubCategoryButton = document.getElementById('saveSubCategoryButton');
  
  // Helper Functions
  function showMessage(text, isSuccess = true) {
    message.textContent = text;
    message.style.color = isSuccess ? 'green' : 'red';
  }
  
  function renderCategories() {
    categoriesContainer.innerHTML = '';
    categories.forEach((category, index) => {
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category';
  
      const title = document.createElement('div');
      title.textContent = category.name;
      title.className = 'category-title';
      categoryElement.appendChild(title);
  
      if (category.subcategories.length > 0) {
        const subList = document.createElement('ul');
        category.subcategories.forEach(sub => {
          const subItem = document.createElement('li');
          subItem.textContent = sub.name;
          subList.appendChild(subItem);
        });
        categoryElement.appendChild(subList);
      }
  
      categoriesContainer.appendChild(categoryElement);
    });
  }
  
  // Event Handlers
  addMainCategoryButton.addEventListener('click', () => {
    const name = mainCategoryInput.value.trim();
    if (!name) {
      showMessage('Main 카테고리 이름을 입력해주세요.', false);
      return;
    }
    if (forbiddenCategories.includes(name)) {
      showMessage('카테고리가 규정에 어긋납니다.', false);
      return;
    }
    if (categories.some(cat => cat.name === name)) {
      showMessage('중복된 Main 카테고리입니다.', false);
      return;
    }
    categories.push({ name, subcategories: [] });
    mainCategoryInput.value = '';
    showMessage('Main 카테고리가 성공적으로 추가되었습니다.');
    renderCategories();
  });
  
  addSubCategoryButton.addEventListener('click', () => {
    subCategoryModal.classList.remove('hidden');
    mainCategoryList.innerHTML = '';
    categories.forEach((cat, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = cat.name;
      listItem.addEventListener('click', () => {
        selectedMainCategory = cat;
        Array.from(mainCategoryList.children).forEach(item => item.classList.remove('selected'));
        listItem.classList.add('selected');
      });
      mainCategoryList.appendChild(listItem);
    });
  });
  
  saveSubCategoryButton.addEventListener('click', () => {
    const name = subCategoryInput.value.trim();
    if (!selectedMainCategory || !name) {
      showMessage('상위 카테고리와 이름을 확인해주세요.', false);
      return;
    }
    selectedMainCategory.subcategories.push({ name });
    subCategoryInput.value = '';
    selectedMainCategory = null;
    subCategoryModal.classList.add('hidden');
    showMessage('Sub 카테고리가 성공적으로 추가되었습니다.');
    renderCategories();
  });
  
  customerServiceButton.addEventListener('click', () => {
    inquiryModal.classList.remove('hidden');
  });
  
  closeInquiryModal.addEventListener('click', () => {
    inquiryModal.classList.add('hidden');
  });
  
  sendInquiryButton.addEventListener('click', () => {
    alert('문의가 전송되었습니다.');
    inquiryModal.classList.add('hidden');
  });