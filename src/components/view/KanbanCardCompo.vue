<template>

  <div class="contains">
    <div class="card-member">
      <ProfileImage v-for="(member, index) in card.members" :key="index" :src="member.avatar" alt="Member Avatar" :width="25" :height="25" />
    </div>
    <div class="card-info">
      <div class="card-title">{{ card.title }}</div>
      <div class="card-labels">
        <span class="label" :style="priorityStyle">{{ card.priority }}</span>
        <span class="label" :style="taskSizeStyle">{{ card.task_size }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import ProfileImage from '../common/item/ProfileImageItem.vue';

export default {
  components: {
    ProfileImage,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // priority에 따른 배경색 결정
    const priorityStyle = computed(() => {
      let backgroundColor;
      let color;
      switch (props.card.priority) {
        case '낮음':
          backgroundColor = '#9BF09B';
          break;
        case '중간':
          backgroundColor = '#9BB8F0';
          break;
        case '높음':
          backgroundColor = '#E99BF0';
          break;
        case '긴급':
          backgroundColor = '#E45959';
          color = '#ffffff';
          break;
        default:
          backgroundColor = '#e0e0e0'; // 기본 색상
      }
      return { backgroundColor, color };
    });

    // task_size에 따른 배경색 결정
    const taskSizeStyle = computed(() => {
      let backgroundColor;
      switch (props.card.task_size) {
        case 'Small':
          backgroundColor = '#CEF2CE';
          break;
        case 'Medium':
          backgroundColor = '#CEE0F2';
          break;
        case 'Large':
          backgroundColor = '#E0CEF2';
          break;
        case 'Extra Large':
          backgroundColor = '#F2CECE';
          break;
        default:
          backgroundColor = '#e0e0e0'; // 기본 색상
      }
      return { backgroundColor };
    });

    return {
      priorityStyle,
      taskSizeStyle,
    };
  },
};
</script>

<style scoped>
.contains {
  /* background: #f0f8ff; */
  border: 1px solid #6b9e9b;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}

.card-member {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.card-info {
  margin-top: 10px;
  text-align: left;
}

.card-title {
  font-weight: bold;
  font-size: 18px;
}

.card-labels {
  margin-top: 15px;
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.label {
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid #6b9e9b;
}
</style>
