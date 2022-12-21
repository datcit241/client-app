const homeButton = {
    text: 'Go to Home',
    link: '/'
}

const loginButton = {
    text: 'Login',
    link: '/login'
}

const errorConfig = {
    url: '/assets/illustrations/',
    400: {
        title: '400 Bad Request',
        message: 'Your request resulted in an error.',
        img: 'illustration_400.png',
        button: homeButton
    },
    401: {
        title: '401 Unauthorized',
        message: 'Authorization required!',
        desc: 'Sorry, your request could not be processed',
        img: 'illustration_401.jpg',
        button: loginButton
    },
    403: {
        title: '401 Forbidden',
        message: 'This is forbidden area!',
        desc: 'Access to this resource on the server is denied',
        img: 'illustration_403.jpg',
        button: loginButton
    },
    404: {
        title: '404 Page Not Found',
        message: 'Sorry, page not found!',
        desc: 'Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.',
        img: 'illustration_404.svg',
        button: homeButton
    },
    500: {
        title: '500 Internal Server Error',
        desc: 'Sorry, we had some technical problems during your last operation.',
        img: 'illustration_500.webp',
        button: homeButton
    }
}

export default errorConfig;