const imageInput = document.getElementById("image");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const uploadImageBtn = document.getElementById("uploadImageBtn");
const openModalBtn = document.getElementById("openModalBtn");
const locationModal = document.getElementById("locationModal");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const saveModalBtn = document.getElementById("saveModalBtn");
const modalLocationInput = document.getElementById("modalLocationInput");
const modalTimeInput = document.getElementById("modalTimeInput");
const locationTimeList = document.getElementById("locationTimeList");
const form = document.getElementById("itemForm");
const categorySelect = document.getElementById("category");

const categoriesFile = "./js/categories.json";
let categories = [];

// 파일에서 카테고리 불러오기
async function loadCategories() {
  try {
    const response = await fetch(categoriesFile);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    categories = await response.json();
    populateCategories();
  } catch (error) {
    console.error("카테고리 파일을 불러오는 중 오류 발생:", error);
  }
}

// 드롭다운에 카테고리 표시
function populateCategories() {
  categorySelect.innerHTML = '<option value="">카테고리 선택</option>';
  categories.forEach((category) => {
    const mainOption = document.createElement("option");
    mainOption.value = category.name;
    mainOption.textContent = category.name;
    mainOption.style.fontWeight = "bold";
    categorySelect.appendChild(mainOption);

    category.subcategories.forEach((sub) => {
      const subOption = document.createElement("option");
      subOption.value = `${category.name} - ${sub.name}`;
      subOption.textContent = `  ↳ ${sub.name}`;
      subOption.style.paddingLeft = "10px";
      categorySelect.appendChild(subOption);
    });
  });
}

// 카테고리 파일 업데이트
async function updateCategoriesFile() {
  try {
    const response = await fetch(categoriesFile, {
      method: "POST", // 또는 실제 백엔드 환경에서는 적합한 메소드 사용
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categories, null, 2),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("카테고리 파일을 업데이트하는 중 오류 발생:", error);
  }
}

// 이미지 업로드 미리보기
uploadImageBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", () => {
  const files = imageInput.files;
  imagePreviewContainer.innerHTML = "";

  if (files.length > 0) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        imagePreviewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  } else {
    imagePreviewContainer.innerHTML = "<span>이미지가 여기에 표시됩니다.</span>";
  }
});

// 위치 및 시간 추가 모달
openModalBtn.addEventListener("click", () => {
  locationModal.style.display = "flex";
});

cancelModalBtn.addEventListener("click", () => {
  modalLocationInput.value = "";
  modalTimeInput.value = "";
  locationModal.style.display = "none";
});

saveModalBtn.addEventListener("click", () => {
  const location = modalLocationInput.value.trim();
  const time = modalTimeInput.value;

  if (location && time) {
    const locationTimeItem = document.createElement("div");
    locationTimeItem.classList.add("location-time-item");
    locationTimeItem.innerHTML = `
      <span>${location}, ${time}</span>
      <button type="button" class="remove-btn">Remove</button>
    `;

    locationTimeItem.querySelector(".remove-btn").addEventListener("click", () => {
      locationTimeItem.remove();
    });

    locationTimeList.appendChild(locationTimeItem);
    modalLocationInput.value = "";
    modalTimeInput.value = "";
    locationModal.style.display = "none";
  } else {
    alert("위치와 시간을 모두 입력해주세요.");
  }
});

// 물품 등록 처리
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const category = document.getElementById("category").value;
  const locations = Array.from(locationTimeList.children).map((item) => item.querySelector("span").textContent);

  if (!title || !price || !category) {
    alert("모든 필수 항목을 입력해주세요.");
    return;
  }

  alert(`물품 등록 완료!\n제목: ${title}\n설명: ${description}\n가격: ${price}\n카테고리: ${category}\n거래 장소 및 시간: ${locations.join(", ")}`);

  // 새 항목 추가 처리 (선택사항)
  const [mainCategory, subCategory] = category.split(" - ");
  const targetCategory = categories.find((cat) => cat.name === mainCategory);
  if (subCategory && targetCategory) {
    targetCategory.subcategories.push({ name: subCategory, subcategories: [] });
    await updateCategoriesFile();
  }

  form.reset();
  locationTimeList.innerHTML = "";
  imagePreviewContainer.innerHTML = "<span>이미지가 여기에 표시됩니다.</span>";
});

// 페이지 로드 시 카테고리 불러오기
document.addEventListener("DOMContentLoaded", loadCategories);
