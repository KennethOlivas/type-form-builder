import { CreateFormInput } from "@/lib/types/db";

export interface Template extends CreateFormInput {
    id: string;
    name: string;
    category: "Research" | "HR" | "Marketing";
    description: string;
}

export const templates: Template[] = [
    // ============================================================================
    // Research and Feedback
    // ============================================================================
    {
        id: "csat",
        name: "Customer Satisfaction (CSAT)",
        category: "Research",
        description: "Measure immediate satisfaction after a specific interaction.",
        title: "Customer Satisfaction Survey",
        style: {
            backgroundColor: "#ffffff",
            textColor: "#000000",
            buttonColor: "#000000",
            buttonTextColor: "#ffffff",
            borderRadius: 8,
            fontFamily: "sans",
        },
        welcomeScreen: {
            enabled: true,
            title: "How did we do?",
            description: "Your feedback helps us improve our service.",
            buttonText: "Start Survey",
            backgroundOpacity: 0,
            contentAlignment: "center",
            splitScreen: false,
            showTimeEstimate: true,
            showRespondentCount: false,
        },
        questions: [
            {
                id: "q1",
                type: "rating",
                label: "Overall, how satisfied were you with your recent experience?",
                required: true,
                ratingScale: 5,
                position: 0,
                logic: {
                    enabled: true,
                    defaultDestinationType: "end-form", // Default skip Q3 if >= 4
                    rules: [
                        {
                            id: "rule1",
                            operator: "less-than", // Logic: <= 3
                            value: 4, // "Less than 4" covers 1, 2, 3
                            destinationType: "specific-question",
                            destinationQuestionId: "q3",
                        },
                    ],
                },
            },
            {
                id: "q2",
                type: "yes-no",
                label: "Did our team successfully resolve your issue?",
                required: true,
                position: 1,
            },
            {
                id: "q3",
                type: "long-text",
                label: "What could we have done better?",
                required: false,
                position: 2,
            },
        ],
    },
    {
        id: "nps",
        name: "Net Promoter Score (NPS)",
        category: "Research",
        description: "Measure customer loyalty and predict business growth potential.",
        title: "Net Promoter Score Survey",
        style: {
            backgroundColor: "#f3f4f6",
            textColor: "#1f2937",
            buttonColor: "#2563eb",
            buttonTextColor: "#ffffff",
            borderRadius: 12,
            fontFamily: "sans",
        },
        welcomeScreen: {
            enabled: true,
            title: "We value your opinion",
            description: "Help us serve you better by answering a few quick questions.",
            buttonText: "Begin",
            backgroundOpacity: 0,
            contentAlignment: "center",
            splitScreen: false,
            showTimeEstimate: true,
            showRespondentCount: false,
        },
        questions: [
            {
                id: "q1",
                type: "rating", // Using rating as proxy for Opinion Scale 0-10
                label: "How likely are you to recommend us to a friend or colleague?",
                required: true,
                ratingScale: 10,
                position: 0,
                logic: {
                    enabled: true,
                    defaultDestinationType: "end-form", // Promoters (9-10) go to end
                    rules: [
                        {
                            id: "rule1",
                            operator: "less-than", // Detractors (0-6)
                            value: 7,
                            destinationType: "specific-question",
                            destinationQuestionId: "q2",
                        },
                        {
                            id: "rule2",
                            operator: "between", // Passives (7-8)
                            value: 7,
                            valueMax: 8,
                            destinationType: "end-form", // Optional: could go to Q2 if desired
                        },
                    ],
                },
            },
            {
                id: "q2",
                type: "long-text",
                label: "What is the primary reason for your score?",
                required: false,
                position: 1,
            },
        ],
    },

    // ============================================================================
    // Human Resources (HR)
    // ============================================================================
    {
        id: "job-application",
        name: "Job Application Form",
        category: "HR",
        description: "Create a modern, professional recruiting funnel.",
        title: "Job Application",
        style: {
            backgroundColor: "#ffffff",
            textColor: "#333333",
            buttonColor: "#000000",
            buttonTextColor: "#ffffff",
            borderRadius: 4,
            fontFamily: "serif",
        },
        welcomeScreen: {
            enabled: true,
            title: "Join Our Team",
            description: "We are looking for talented individuals to join us.",
            buttonText: "Apply Now",
            backgroundOpacity: 0,
            contentAlignment: "left",
            splitScreen: true,
            showTimeEstimate: true,
            showRespondentCount: false,
        },
        questions: [
            {
                id: "q1",
                type: "short-text",
                label: "Full Name",
                required: true,
                position: 0,
            },
            {
                id: "q1_email",
                type: "email",
                label: "Email Address",
                required: true,
                position: 1,
            },
            {
                id: "q1_phone",
                type: "phone",
                label: "Phone Number",
                required: true,
                position: 2,
            },
            {
                id: "q2",
                type: "dropdown",
                label: "Which role are you applying for?",
                required: true,
                options: ["Senior Developer", "Junior Developer", "Designer", "Intern", "Product Manager"],
                position: 3,
            },
            {
                id: "q3",
                type: "file-upload",
                label: "Please upload your CV/Resume.",
                required: true,
                position: 4,
            },
            {
                id: "q4",
                type: "long-text",
                label: "Why do you want to work here?",
                required: true,
                position: 5,
            },
        ],
    },

    // ============================================================================
    // Marketing and Sales
    // ============================================================================
    {
        id: "lead-gen",
        name: "Qualified Lead Generation",
        category: "Marketing",
        description: "Quickly gather contact information and qualify leads.",
        title: "Contact Sales",
        style: {
            backgroundColor: "#111827",
            textColor: "#f9fafb",
            buttonColor: "#3b82f6",
            buttonTextColor: "#ffffff",
            borderRadius: 8,
            fontFamily: "sans",
        },
        welcomeScreen: {
            enabled: true,
            title: "Get in Touch",
            description: "Answer a few questions to help us direct your inquiry.",
            buttonText: "Start",
            backgroundOpacity: 0,
            contentAlignment: "center",
            splitScreen: false,
            showTimeEstimate: false,
            showRespondentCount: false,
        },
        questions: [
            {
                id: "q1",
                type: "short-text",
                label: "First Name",
                required: true,
                position: 0,
            },
            {
                id: "q2",
                type: "email",
                label: "Work Email Address",
                required: true,
                position: 1,
            },
            {
                id: "q3",
                type: "dropdown",
                label: "What is your role?",
                required: true,
                options: ["Director", "Manager", "Employee", "Other"],
                position: 2,
                logic: {
                    enabled: true,
                    defaultDestinationType: "end-form", // Employee/Other -> End
                    rules: [
                        {
                            id: "rule1",
                            operator: "equals",
                            value: "Director",
                            destinationType: "specific-question",
                            destinationQuestionId: "q4",
                        },
                        {
                            id: "rule2",
                            operator: "equals",
                            value: "Manager",
                            destinationType: "specific-question",
                            destinationQuestionId: "q4",
                        },
                    ],
                },
            },
            {
                id: "q4",
                type: "dropdown",
                label: "What is your company size?",
                required: true,
                options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
                position: 3,
            },
        ],
    },
    {
        id: "product-quiz",
        name: "Interactive Product Quiz",
        category: "Marketing",
        description: "Engage the user and subtly collect contact information.",
        title: "Find Your Perfect Match",
        style: {
            backgroundColor: "#fff1f2",
            textColor: "#881337",
            buttonColor: "#e11d48",
            buttonTextColor: "#ffffff",
            borderRadius: 20,
            fontFamily: "sans",
        },
        welcomeScreen: {
            enabled: true,
            title: "Product Finder",
            description: "Discover what suits your needs in 30 seconds.",
            buttonText: "Take Quiz",
            backgroundOpacity: 0,
            contentAlignment: "center",
            splitScreen: false,
            showTimeEstimate: true,
            showRespondentCount: false,
        },
        questions: [
            {
                id: "q1",
                type: "multiple-choice",
                label: "What is your primary goal?",
                required: true,
                options: ["Efficiency", "Cost Saving", "Quality", "Speed"],
                position: 0,
            },
            {
                id: "q2",
                type: "multiple-choice",
                label: "How often do you use this type of product?",
                required: true,
                options: ["Daily", "Weekly", "Monthly", "Rarely"],
                position: 1,
            },
            {
                id: "q3",
                type: "multiple-choice",
                label: "What is your budget range?",
                required: true,
                options: ["Low", "Medium", "High", "Unlimited"],
                position: 2,
            },
            {
                id: "q4",
                type: "email",
                label: "Enter your email to see your results!",
                required: true,
                position: 3,
            },
        ],
    },
];
