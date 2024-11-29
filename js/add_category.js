const forbiddenCategories = [
  "아편",
  "코카인",
  "헤로인",
  "모르핀",
  "펜타닐",
  "페티틴",
  "암페타민",
  "케타민",
  "바르비탈",
  "벤조디아제핀",
  "졸피뎀",
  "프로포폴",
  "대마초",
  "대마",
  "칸나비놀",
  "칸나비디올",
  "테트라히드로칸나비놀",
  "권총",
  "소총",
  "기관총",
  "포",
  "엽총",
  "공기총",
  "모의총포",
  "고무줄총",
  "발사장치",
  "도검",
  "칼",
  "비수",
  "창",
  "잭나이프",
  "비출 나이프",
  "화약",
  "폭약",
  "화공품",
  "최루분사기",
  "전자충격기",
  "석궁",
  "경찰복",
  "교통근무복",
  "계급장",
  "모자",
  "경찰휘장",
  "경찰 수갑",
  "방패",
  "삼단봉",
  "군복",
  "전투복",
  "방탄복",
  "군용 배낭",
  "불법복제 영상물",
  "불법복제 소프트웨어",
  "음란물",
  "불법 스트리밍 셋탑박스",
  "기준초과 식품",
  "무허가 식품",
  "미신고 식품",
  "어린이 정서 저해 식품",
  "고열량 저영양 식품",
  "무허가 샘물",
  "테스터 화장품",
  "샘플 화장품",
  "식품 모방 화장품",
  "무허가 의약외품",
  "소분 의약외품",
  "체온계",
  "혈압계",
  "혈당측정기",
  "임신 테스트기",
  "배란 테스트기",
  "탈모치료기",
  "레이저 제모기",
  "멸종위기 동식물",
  "금어기 물고기",
  "총알오징어",
  "총알문어",
  "리콜 상품",
  "미인증 제품",
  "KC 미인증",
  "가스용품",
  "정수기",
  "고압가스",
  "소방용품",
  "헌혈증",
  "양도 불가 상품권",
  "사이버머니",
  "가짜 화폐",
  "습득물",
  "장물",
  "불법 복제 휴대폰",
  "명의변경 휴대폰",
  "소주",
  "맥주",
  "위스키",
  "와인",
  "전자담배",
  "금연 보조제",
  "성기확대",
  "자위기구",
  "성인용 비비탄 총",
  "몰래 카메라",
  "위장형 카메라",
  "욱일기",
  "나치 문양",
  "이란 제품",
  "북한 제품",
  "농약",
  "해외배송 신선식품",
];
  

const categories = [
  {
    name: "디지털기기/생활가전",
    subcategories: [
    ],
  },
  {
    name: "가구/인테리어",
    subcategories: [
    ],
  },
  {
    name: "패션/잡화",
    subcategories: [
      { name: "시계", subcategories: [] },
      { name: "벨트", subcategories: [] },
    ],
  },
  {
    name: "취미/게임/음반",
    subcategories: [
    ],
  },
  {
    name: "도서/교재",
    subcategories: [
      { name: "소설", subcategories: [] },
      { name: "자기계발", subcategories: [] },
      { name: "교과서", subcategories: [] },
    ],
  },
];


const categoriesContainer = document.getElementById("categoriesContainer");

  let selectedMainCategory = null;
  
  
  const mainCategoryInput = document.getElementById('mainCategoryInput');
  const subCategoryInput = document.getElementById('subCategoryInput');
  const addMainCategoryButton = document.getElementById('addMainCategoryButton');
  const addSubCategoryButton = document.getElementById('addSubCategoryButton');
  const message = document.getElementById('message');
  
  const inquiryModal = document.getElementById('inquiryModal');
  const closeInquiryModal = document.getElementById('closeInquiryModal');
  const customerServiceButton = document.getElementById('customerServiceButton');
  const sendInquiryButton = document.getElementById('sendInquiryButton');
  const subCategoryModal = document.getElementById('subCategoryModal');
  const mainCategoryList = document.getElementById('mainCategoryList');
  const saveSubCategoryButton = document.getElementById('saveSubCategoryButton');
  
  
  function showMessage(text, isSuccess = true) {
    message.textContent = text;
    message.style.color = isSuccess ? 'green' : 'red';
  }
  
  
function renderCategories() {
  categoriesContainer.innerHTML = ""; 
  categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "category";

    
    const title = document.createElement("div");
    title.textContent = category.name;
    title.className = "category-title";
    categoryElement.appendChild(title);

    
    if (category.subcategories.length > 0) {
      const subList = document.createElement("ul");
      category.subcategories.forEach((sub) => {
        const subItem = document.createElement("li");
        subItem.textContent = sub.name;
        subList.appendChild(subItem);
      });
      categoryElement.appendChild(subList);
    }

    
    categoriesContainer.appendChild(categoryElement);
  });
}


renderCategories();
  
  
  addMainCategoryButton.addEventListener('click', () => {
    const name = mainCategoryInput.value.trim();
    if (!name) {
      showMessage('물품 카테고리 이름을 입력해주세요.', false);
      return;
    }
    if (forbiddenCategories.includes(name)) {
      showMessage('카테고리가 규정에 어긋납니다.', false);
      return;
    }
    if (categories.some(cat => cat.name === name)) {
      showMessage('중복된 물품 카테고리입니다.', false);
      return;
    }
    categories.push({ name, subcategories: [] });
    mainCategoryInput.value = '';
    showMessage('물품 카테고리가 성공적으로 추가되었습니다.');
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
    showMessage('세부 카테고리가 성공적으로 추가되었습니다.');
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