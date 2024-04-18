
const baseUrl = 'http://demo4889594.mockable.io'

export const getExercise = (url:string) => {
    return fetch(`${baseUrl}/${url}`)
        .then(res => res.json())
}