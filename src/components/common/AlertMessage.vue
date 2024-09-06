<template>
    <div class="timeout-container">
        <div class="timeout-message">
            <p>서버 응답 시간이 초과되었습니다.<br />잠시 후 다시 시도해 주세요.</p>
            <button class="home-button" @click="goHome">홈으로</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        goHome() {
            // 홈으로 이동하는 로직
            this.$router.push('/');
        },
    },
};
</script>

<style scoped>
.timeout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f7fb;
}

.timeout-message {
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    background-color: #e7f1f5;
    border: 1px solid #b0c4ce;
    max-width: 400px;
    width: 100%;
}

.timeout-message p {
    margin: 0;
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
}

.home-button {
    background: linear-gradient(135deg, #5a6d8c, #112f4e);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.home-button:hover {
    background: linear-gradient(135deg, #4a5c7a, #0d2443);
}
</style>
