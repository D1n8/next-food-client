export const routes = {
    main: {
        mask: "/",
        create: () => '/'
    },
    recipesList: {
        mask: '/recipes',
        create: () => '/recipes'
    },
    recipe: {
        mask: '/recipe/:id',
        create: (id: string) => `/recipe/${id}`
    },
    favorites: {
        mask: '/favorites',
        create: () => '/favorites'
    },
    register: {
        mask: '/register',
        create: () => '/register'
    },
    login: {
        mask: '/login',
        create: () => '/login'
    },
    profile: {
        mask: '/profile',
        create: () => '/profile'
    }
}