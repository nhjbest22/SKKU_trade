document.addEventListener("DOMContentLoaded", () => {
  const lectureContainer = document.getElementById("lectureContainer");
  const addLectureButton = document.getElementById("addLectureButton");
  const cancelButton = document.getElementById("cancelButton");
  const lectureForm = document.getElementById("lectureForm");

  // 로컬스토리지에서 강의 데이터 조회
  function loadLectureData() {
    const lectureData = JSON.parse(localStorage.getItem("lectures")) || [];
    lectureContainer.innerHTML = ""; // 기존 강의 폼 초기화

    if (lectureData.length === 0) {
      addEmptyLectureForm();
    } else {
      lectureData.forEach((lecture) => {
        const newLecture = createLectureForm();
        newLecture.querySelector("select[name='daySelect']").value = lecture.day;
        newLecture.querySelector("input[name='startTime']").value = lecture.startTime;
        newLecture.querySelector("input[name='endTime']").value = lecture.endTime;
        newLecture.querySelector("input[name='location']").value = lecture.location;
        lectureContainer.appendChild(newLecture);
      });
    }
    updateDeleteButtons();
  }

  // 강의 폼 추가 함수
  function addEmptyLectureForm() {
    const newLecture = createLectureForm();
    lectureContainer.appendChild(newLecture);
    updateDeleteButtons();
  }

  // 강의 폼 생성 함수
  function createLectureForm() {
    const template = document.createElement("div");
    template.classList.add("lecture-form", "mb-4", "border", "border-gray-300", "p-4", "rounded-md");

    template.innerHTML = `
      <label class="block text-sm font-medium text-gray-700 mb-1" for="daySelect">강의 요일</label>
      <select name="daySelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200">
        <option value="">-- 요일 선택 --</option>
        <option value="월">월</option>
        <option value="화">화</option>
        <option value="수">수</option>
        <option value="목">목</option>
        <option value="금">금</option>
      </select>

      <label class="block text-sm font-medium text-gray-700 mt-4 mb-1" for="startTime">시작 시간</label>
      <input type="time" name="startTime" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200" min="09:00" max="21:00" step="900" />

      <label class="block text-sm font-medium text-gray-700 mt-4 mb-1" for="endTime">종료 시간</label>
      <input type="time" name="endTime" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200" min="09:00" max="21:00" step="900" />

      <label class="block text-sm font-medium text-gray-700 mt-4 mb-1" for="location">강의실</label>
      <input type="text" name="location" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200" maxlength="6" placeholder="강의실 코드" />

      <button type="button" class="delete-lecture w-full py-2 mt-4 text-white bg-red-500 hover:bg-red-600 rounded-md focus:outline-none">강의 삭제</button>
    `;

    return template;
  }

  // 로컬스토리지에 강의 데이터 저장
  function saveLectureData() {
    const lectureData = [];
    const lectureForms = document.querySelectorAll(".lecture-form");
    lectureForms.forEach((form) => {
      const day = form.querySelector("select[name='daySelect']").value;
      const startTime = form.querySelector("input[name='startTime']").value;
      const endTime = form.querySelector("input[name='endTime']").value;
      const location = form.querySelector("input[name='location']").value;
      lectureData.push({ day, startTime, endTime, location });
    });
    localStorage.setItem("lectures", JSON.stringify(lectureData));
  }

  // 강의 삭제 버튼 활성화/비활성화
  function updateDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-lecture");
    deleteButtons.forEach((button) => {
      button.disabled = deleteButtons.length === 1;
    });
  }

  // 강의 추가 버튼 클릭 이벤트
  addLectureButton.addEventListener("click", () => {
    addEmptyLectureForm();
  });

  // 강의 삭제 버튼 클릭 이벤트
  lectureContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-lecture")) {
      const lectureForms = document.querySelectorAll(".lecture-form");
      if (lectureForms.length > 1) {
        event.target.closest(".lecture-form").remove();
        updateDeleteButtons();
      }
    }
  });

  // 폼 제출 이벤트
  lectureForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveLectureData();
    alert("강의 정보가 저장되었습니다!");
    console.log(JSON.parse(localStorage.getItem("lectures")));
    window.history.back();
  });

  // 취소 버튼 클릭 이벤트
  cancelButton.addEventListener("click", () => {
    window.history.back();
  });

  // 초기 데이터 로드
  loadLectureData();
});
