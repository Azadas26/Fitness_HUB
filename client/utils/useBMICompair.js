export const evaluvateBMIRatio = (currentBmi) => {


    console.log("cAAAa", currentBmi);
    if (currentBmi > 60) {
        return "error"
    }
    else if (currentBmi < 18.5) {
        return {
            type: "Underweight",
            bodySize: "Small",
            message: "Your BMI indicates you're underweight. Gaining weight in a healthy way is essential to build strength and immunity.",
            diet: [
                "High-protein foods: eggs, lean meats, legumes",
                "Healthy fats: nuts, seeds, avocados, olive oil",
                "Complex carbs: whole grain bread, oats, brown rice",
                "Milkshakes, smoothies, and cheese to add calories"
            ],
            exercise: [
                "Strength training: to build lean muscle mass",
                "Avoid intense cardio",
                "Yoga or Pilates for flexibility and muscle tone"
            ]
        };
    } else if (currentBmi < 25) {
        return {
            type: "Normal weight",
            bodySize: "Medium",
            message: "Great! Your weight is in the healthy range. Maintain your routine with balanced nutrition and regular exercise.",
            diet: [
                "Balanced meals with fruits, veggies, proteins, and grains",
                "Hydration is key — drink enough water",
                "Limit processed sugar and fried items"
            ],
            exercise: [
                "Moderate cardio: walking, swimming, cycling",
                "Strength training 2–3x/week",
                "Daily stretching or yoga for mobility"
            ]
        };
    } else if (currentBmi < 30) {
        return {
            type: "Overweight",
            bodySize: "Large",
            message: "You’re slightly over your ideal weight. Small lifestyle changes can bring big improvements in your health.",
            diet: [
                "Low-carb, high-fiber foods (vegetables, beans, whole grains)",
                "Avoid sugary drinks, fast food, and refined carbs",
                "Eat smaller meals frequently",
                "Green tea or herbal drinks"
            ],
            exercise: [
                "30+ minutes of brisk walking or jogging",
                "Bodyweight training: squats, planks, push-ups",
                "Cardio (Zumba, dancing, cycling)"
            ]
        };
    } else if (currentBmi < 35) {
        return {
            type: "Obese (Class 1)",
            bodySize: "Large",
            message: "You are in the obesity range. It’s important to take action to reduce the risk of heart disease, diabetes, and joint pain.",
            diet: [
                "High-fiber, low-calorie meals",
                "Leafy greens, oats, berries, lean protein (chicken, tofu)",
                "Cut down on sugar, red meat, and processed snacks"
            ],
            exercise: [
                "Low-impact cardio: elliptical, swimming, stationary bike",
                "Start slow, increase duration gradually",
                "Resistance bands and light weights"
            ]
        };
    } else if (currentBmi < 40) {
        return {
            type: "Obese (Class 2)",
            bodySize: "Very Large",
            message: "Your weight may be affecting your energy, mobility, and long-term health. A focused plan can help restore balance.",
            diet: [
                "Focus on portion control and mindful eating",
                "Soups, salads, and low-carb high-protein diets",
                "Consult a dietician for a structured plan"
            ],
            exercise: [
                "Start with walking or chair exercises",
                "Gentle strength exercises (seated leg lifts, resistance bands)",
                "Consider physiotherapy-assisted plans"
            ]
        };
    } else {
        return {
            type: "Obese (Class 3)",
            bodySize: "Extremely Large",
            message: "You are in the severe obesity category. Please consider professional support — your health is a top priority, and every small change matters.",
            diet: [
                "Supervised meal plans (medical nutrition therapy)",
                "Lean protein, fiber-rich veggies, limited sodium",
                "Liquid meals (shakes, soups) to manage calories"
            ],
            exercise: [
                "Consult a healthcare provider before starting",
                "Begin with gentle movement: chair yoga, aquatic exercises",
                "Slowly build to short walks and resistance training"
            ]
        };
    }
};


