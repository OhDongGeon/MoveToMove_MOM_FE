<template>
  <div>
    <div class="assign-details">
      <!-- 담당자 -->
      <p>
        <strong>담당자</strong> 
        <span class="assignee-info">
          <img :src="assignee.avatar" alt="Avatar" class="avatar" />
          {{ assignee.name }}
        </span>
      </p>

      <!-- 우선순위 -->
      <p>
        <strong>우선순위</strong> 
        <span class="priority">{{ assignee.priority }}</span>
      </p>

      <!-- 작업크기 -->
      <p>
        <strong>작업크기</strong> 
        <span class="size">{{ assignee.size }}</span>
      </p>

      <!-- 시작날짜 -->
      <p>
        <strong>시작날짜</strong> 
        <span class="date">{{ assignee.startDate }}</span>
      </p>

      <!-- 종료날짜 -->
      <p>
        <strong>종료날짜</strong> 
        <span class="date">{{ assignee.endDate }}</span>
      </p>
    </div>
    <!-- 카드 삭제 버튼 -->
    <div class="delete-button">
      <CustomButton 
      :default-text="`카드 삭제`"
      :width="130"
      :height="35"
      font-size="18"
      @click="deleteCard"
      ></CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from '@/components/common/item/RoundButtonItem.vue';

export default {
  name: "AssignInfo",
  components:  {
    CustomButton
  },
  setup() {
    const assignee = {
      name: "닉네임",
      avatar:  "https://via.placeholder.com/30",
      priority: "중간",
      size: "Large",
      startDate: "2024-08-13",
      endDate: "2024-08-23",
    };

    // 카드 삭제 함수
    const deleteCard = () => {
      console.log("카드가 삭제되었습니다");
    };
    return {
      assignee,
      deleteCard,
    };
  },
};
</script>

<style scoped>
.assign-details {
  background-color: white;
  padding: 20px;
  border: 1px solid #6b9e9b;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px; /* 카드 삭제 버튼과의 간격 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 350px; /* 박스 최소 너비 */
  min-height: 250px; /* 박스 최소 높이 */
}

.assign-details p {
  margin: 10px 0; /* 요소 간의 간격을 넓게 설정 */
  font-size: 16px; /* 글자 크기 키우기 */
  display: flex; /* 텍스트와 데이터를 수평으로 정렬 */
  width: 100%; /* 요소의 너비를 부모에 맞춤 */
  line-height: 1.5; /* 줄 간격 설정 */
}

.assign-details p strong {
  width: 100px; /* 레이블의 고정 너비 설정 (글자 5자 정도) */
  font-weight: bold;
  font-size: 18px; /* 라벨의 글자 크기 키우기 */
  text-align: left; /* 레이블 왼쪽 정렬 */
  margin-right: 10px; /* 레이블과 값 사이의 간격 */
}

.assignee-info {
  flex-grow: 1; /* 값의 너비를 유연하게 */
  text-align: left; /* 값 왼쪽 정렬 */
  font-size: 16px; /* 값의 글자 크기 키우기 */
  padding: 4px 8px; /* 값의 안쪽 여백 설정 */
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.priority {
  display: inline-block;
  padding: 4px 8px;
  background-color: #9BB8F0; /* 배경색 설정 */
  border-radius: 8px; /* 둥근 모서리 설정 */
  margin-left: 10px;
  font-weight: bold;

}
.size {
  display: inline-block;
  padding: 4px 8px;
  background-color: #E0CEF2; /* 배경색 설정 */
  border-radius: 8px; /* 둥근 모서리 설정 */
  margin-left: 10px;
  font-weight: bold;

}
.date {
  font-weight: bold;
  padding: 4px 8px;
}
.delete-button {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
}
</style>
