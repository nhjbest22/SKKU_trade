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
    imagePreviewContainer.innerHTML =
      "<span>이미지가 여기에 표시됩니다.</span>";
  }
});

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

    locationTimeItem
      .querySelector(".remove-btn")
      .addEventListener("click", () => {
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const category = document.getElementById("category").value;
  const locations = Array.from(locationTimeList.children).map(
    (item) => item.querySelector("span").textContent
  );

  if (!title || !price || !category) {
    alert("모든 필수 항목을 입력해주세요.");
    return;
  }

  alert(
    `물품 등록 완료!\n제목: ${title}\n설명: ${description}\n가격: ${price}\n카테고리: ${category}\n거래 장소 및 시간: ${locations.join(
      ", "
    )}`
  );

  form.reset();
  locationTimeList.innerHTML = "";
  imagePreviewContainer.innerHTML = "<span>이미지가 여기에 표시됩니다.</span>";
});