import { Metadata } from 'next';
import Page from './_page';

export const metadata: Metadata = {
    title: 'Code Grabber',
    description:
        'Welcome to CodeGrabber, the ultimate blogging platform for coders and developers! CodeGrabber is designed to be a haven for coding enthusiasts where they can share their knowledge, insights, and experiences with the programming community.',
    keywords: [
        'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Go', 'Rust', 'Kotlin',
        'HTML', 'CSS', 'Responsive web design', 'Front-end development', 'Back-end development',
        'UX/UI design', 'React', 'Angular', 'Vue.js', 'iOS development', 'Android development',
        'Swift programming', 'Kotlin programming', 'Data visualization', 'Machine learning',
        'Artificial intelligence', 'Python libraries', 'Agile development', 'Scrum',
        'Test-driven development', 'Continuous integration', 'Continuous deployment',
        'Version control', 'Node.js', 'Django', 'Laravel', 'Ruby on Rails', 'Flask', 'Docker',
        'Kubernetes', 'OOP', 'Functional programming', 'Algorithms', 'Data structures',
        'Design patterns', 'API development'
    ],
    authors: [{ name: 'Sandip Low', url: 'https://sandiplow.github.io' }],
    creator: 'Sandip Low',
    publisher: 'Code Grabber',
    metadataBase: new URL('https://codegrabber.vercel.app'),
    alternates: {
        canonical: '/',
    },
};



export default Page;
