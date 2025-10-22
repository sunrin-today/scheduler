import { sendWebhook } from "../webhook";

export async function WebhookPostNotification() {
    (await fetch('https://api.sunrin.kr/meal/today')).json().then((data) => {
        const response = data.data.meals;
        
        // 급식 정보가 없을 경우
        if(response.length === 0) {
            sendWebhook({
                embeds: [
                    {
                        title: '급식 정보가 없습니다.',
                        color: 0xff0000,
                        timestamp: new Date().toISOString(),
                    }
                ],
                
            });
            return;
        };

        const mealDescription: string = response.map((meal: any) => {
            return `- ${meal.meal} ${meal.code}\n`
        }).join('');

        // 급식 정보가 있을 경우
        sendWebhook({
            embeds: [
                {
                    title: '선린투데이 업로드 알림',
                    description: `
                        \`\`\`${mealDescription}\`\`\`
                    `,
                    color: 0x457bff,
                    timestamp: new Date().toISOString(),
                    image: {
                        url: 'https://item.kakaocdn.net/do/c838c164801d148d4fe09b83adada4c88f324a0b9c48f77dbce3a43bd11ce785'
                    }
                }
            ],
        })
    });    
}