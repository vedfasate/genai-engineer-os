import type { SkillCategory } from '@/types/roadmap'

export const CAREER_ROADMAP: SkillCategory[] = [
    {
        id: 'python',
        name: 'Python',
        targetRole: 'Core programming and scripting',
        topics: [
            {
                id: 'py-basics',
                title: 'Fundamentals & Syntax',
                subtopics: [
                    { id: 'py-1', title: 'Variables, data types and type casting', completed: true },
                    { id: 'py-2', title: 'Conditionals, loops and error handling', completed: true },
                    { id: 'py-3', title: 'Lists, tuples, dictionaries and sets', completed: true },
                ],
            },
            {
                id: 'py-advanced',
                title: 'Advanced Python',
                subtopics: [
                    { id: 'py-4', title: 'Functions, scope and lambda expressions', completed: true },
                    { id: 'py-5', title: 'Object-oriented programming', completed: false },
                    { id: 'py-6', title: 'Decorators and generators', completed: false },
                    { id: 'py-7', title: 'AsyncIO and multiprocessing', completed: false },
                ],
            },
        ],
    },
    {
        id: 'dsa',
        name: 'DSA',
        targetRole: 'Coding rounds and problem solving',
        topics: [
            {
                id: 'dsa-linear',
                title: 'Linear Data Structures',
                subtopics: [
                    { id: 'dsa-1', title: 'Arrays and two pointers', completed: true },
                    { id: 'dsa-2', title: 'Strings and pattern matching', completed: true },
                    { id: 'dsa-3', title: 'Hashing and hash maps', completed: false },
                    { id: 'dsa-4', title: 'Stacks and queues', completed: false },
                    { id: 'dsa-5', title: 'Linked lists', completed: false },
                ],
            },
            {
                id: 'dsa-non-linear',
                title: 'Non-Linear Data Structures',
                subtopics: [
                    { id: 'dsa-6', title: 'Binary trees and BST', completed: false },
                    { id: 'dsa-7', title: 'Graphs with BFS, DFS and Dijkstra', completed: false },
                    { id: 'dsa-8', title: 'Dynamic programming basics', completed: false },
                ],
            },
        ],
    },
    {
        id: 'sql',
        name: 'SQL & Databases',
        targetRole: 'Data querying and backend integration',
        topics: [
            {
                id: 'sql-core',
                title: 'Querying & Joins',
                subtopics: [
                    { id: 'sql-1', title: 'SELECT, WHERE, ORDER BY and LIMIT', completed: true },
                    { id: 'sql-2', title: 'Aggregations, GROUP BY and HAVING', completed: true },
                    { id: 'sql-3', title: 'Inner, left, right and full outer joins', completed: true },
                    { id: 'sql-4', title: 'Subqueries and CTEs', completed: false },
                    { id: 'sql-5', title: 'Window functions with ROW_NUMBER and RANK', completed: false },
                ],
            },
        ],
    },
    {
        id: 'ml',
        name: 'Machine Learning',
        targetRole: 'Predictive modeling and core ML',
        topics: [
            {
                id: 'ml-foundation',
                title: 'Foundations',
                subtopics: [
                    { id: 'ml-1', title: 'Statistics and probability', completed: true },
                    { id: 'ml-2', title: 'EDA and feature engineering', completed: true },
                    { id: 'ml-3', title: 'Model evaluation and cross-validation', completed: false },
                ],
            },
            {
                id: 'ml-supervised',
                title: 'Supervised & Unsupervised Learning',
                subtopics: [
                    { id: 'ml-4', title: 'Linear and logistic regression', completed: false },
                    { id: 'ml-5', title: 'Decision trees and Random Forests', completed: false },
                    { id: 'ml-6', title: 'Gradient boosting with XGBoost and LightGBM', completed: false },
                    { id: 'ml-7', title: 'Clustering and dimensionality reduction', completed: false },
                    { id: 'ml-8', title: 'Deployment with Streamlit or APIs', completed: false },
                ],
            },
        ],
    },
    {
        id: 'deep-learning',
        name: 'Deep Learning',
        targetRole: 'Neural networks and applied AI',
        topics: [
            {
                id: 'dl-core',
                title: 'Neural Network Core',
                subtopics: [
                    { id: 'dl-1', title: 'Perceptrons and backpropagation', completed: false },
                    { id: 'dl-2', title: 'ANN training and regularization', completed: false },
                    { id: 'dl-3', title: 'CNN basics for computer vision', completed: false },
                    { id: 'dl-4', title: 'RNN, LSTM and sequence modeling', completed: false },
                ],
            },
        ],
    },
    {
        id: 'genai',
        name: 'Generative AI & LLMs',
        targetRole: 'Modern AI engineering',
        topics: [
            {
                id: 'gen-core',
                title: 'LLMs & Architectures',
                subtopics: [
                    { id: 'gen-1', title: 'Transformers and attention mechanism', completed: false },
                    { id: 'gen-2', title: 'Prompt engineering and few-shot learning', completed: false },
                    { id: 'gen-3', title: 'RAG systems and vector search', completed: false },
                    { id: 'gen-4', title: 'Fine-tuning with PEFT and LoRA', completed: false },
                ],
            },
        ],
    },
    {
        id: 'mern',
        name: 'MERN',
        targetRole: 'Full-stack project delivery',
        topics: [
            {
                id: 'mern-core',
                title: 'Application Stack',
                subtopics: [
                    { id: 'mern-1', title: 'React components, hooks and state', completed: true },
                    { id: 'mern-2', title: 'Node.js and Express APIs', completed: true },
                    { id: 'mern-3', title: 'MongoDB schemas and queries', completed: false },
                    { id: 'mern-4', title: 'Authentication and deployment basics', completed: false },
                ],
            },
        ],
    },
    {
        id: 'system-design',
        name: 'System Design',
        targetRole: 'Scalable product engineering',
        topics: [
            {
                id: 'sd-core',
                title: 'Design Fundamentals',
                subtopics: [
                    { id: 'sd-1', title: 'Requirements, APIs and data models', completed: true },
                    { id: 'sd-2', title: 'Caching, queues and background jobs', completed: false },
                    { id: 'sd-3', title: 'Scaling databases and services', completed: false },
                    { id: 'sd-4', title: 'Reliability, observability and tradeoffs', completed: false },
                ],
            },
        ],
    },
    {
        id: 'aptitude',
        name: 'Aptitude',
        targetRole: 'Screening rounds and assessments',
        topics: [
            {
                id: 'apt-core',
                title: 'Assessment Readiness',
                subtopics: [
                    { id: 'apt-1', title: 'Quantitative aptitude', completed: true },
                    { id: 'apt-2', title: 'Logical reasoning', completed: true },
                    { id: 'apt-3', title: 'Verbal ability', completed: false },
                    { id: 'apt-4', title: 'Timed mock tests', completed: false },
                ],
            },
        ],
    },
    {
        id: 'interview-prep',
        name: 'Interview Prep',
        targetRole: 'Offer conversion',
        topics: [
            {
                id: 'int-core',
                title: 'Interview System',
                subtopics: [
                    { id: 'int-1', title: 'Resume and LinkedIn positioning', completed: true },
                    { id: 'int-2', title: 'HR stories and behavioral answers', completed: false },
                    { id: 'int-3', title: 'Technical mock interviews', completed: false },
                    { id: 'int-4', title: 'Company-specific preparation', completed: false },
                ],
            },
        ],
    },
    {
        id: 'projects',
        name: 'Projects',
        targetRole: 'Resume proof and system demos',
        topics: [
            {
                id: 'proj-list',
                title: 'Portfolio Applications',
                subtopics: [
                    { id: 'proj-1', title: 'Hybrid Fake News Detector', completed: true },
                    { id: 'proj-2', title: 'PrepStack student utility platform', completed: true },
                    { id: 'proj-3', title: 'CareerOS productivity system', completed: false },
                    { id: 'proj-4', title: 'End-to-end ML deployment case study', completed: false },
                ],
            },
        ],
    },
]
