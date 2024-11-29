const lectureContainer = document.getElementById("lectureContainer");
      const addLectureButton = document.getElementById("addLectureButton");
      const cancelButton = document.getElementById("cancelButton");
      const lectureForm = document.getElementById("lectureForm");

      // 강의 삭제 버튼 활성화/비활성화
      function updateDeleteButtons() {
        const deleteButtons = document.querySelectorAll(".delete-lecture");
        deleteButtons.forEach((button, index) => {
          button.disabled = deleteButtons.length === 1;
        });
      }

      // 강의 추가
      addLectureButton.addEventListener("click", () => {
        const newLecture = document.querySelector(".lecture-form").cloneNode(
          true
        );
        newLecture.querySelectorAll("input, select").forEach((field) => {
          field.value = "";
        });
        lectureContainer.appendChild(newLecture);
        updateDeleteButtons();
      });

      // 강의 삭제
      lectureContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-lecture")) {
          const lectureForms = document.querySelectorAll(".lecture-form");
          if (lectureForms.length > 1) {
            event.target.closest(".lecture-form").remove();
            updateDeleteButtons();
          }
        }
      });

      // 강의 확인
      lectureForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const lectureData = [];
        const lectureForms = document.querySelectorAll(".lecture-form");
        lectureForms.forEach((form) => {
          const day = form.querySelector("select[name='daySelect']").value;
          const startTime = form.querySelector("input[name='startTime']").value;
          const endTime = form.querySelector("input[name='endTime']").value;
          const location = form.querySelector("input[name='location']").value;
          lectureData.push({ day, startTime, endTime, location });
        });
        alert("강의 정보가 저장되었습니다!");
        console.log(lectureData); // 저장된 데이터를 확인 (DB 연결 시 사용)
      });

      // 취소 버튼
      cancelButton.addEventListener("click", () => {
        window.history.back();
      });

      // 초기 상태 설정
      updateDeleteButtons();