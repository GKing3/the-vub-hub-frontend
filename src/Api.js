const url = 'http://localhost:8000/';

const Api = {
    getUsers: async () => {
        const response = await fetch(url + 'users');
        console.log(response);
        return response.json();
    },
    getBlogs: () => {
        return [
            {
                id: 1,
                title: 'How Virtual Reality is Changing the Way We Learn: Real-World Examples',
                image: 'post-001.jpg',
                category: 'Science and Technology',
                author: 'John Doe',
                author_image: 'avatar.png',
                published_date: Date.now(),
                reading_time: '8 minutes',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                tags: 'Technology, Virtual Reality'
            }
        ]
    }
}

export default Api;