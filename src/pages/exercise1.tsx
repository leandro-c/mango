import React,{useState, useEffect} from 'react'
import { useRouter } from "next/navigation";
import Range from '@/components/Range/Range'
import { getExercise } from '@/services/api'
interface Props {}
interface Values {
    min: number;
    max: number;
}
function Exercise1(props: Props) {
    const {} = props

    const [values, setValues] = useState<Values>({ min: 0, max: 100 });
    const [value, setValue] = useState<Values | null>(null)
    const router = useRouter();
    

    useEffect(() => {
        getExercise('exercise1').then(setValues).catch((error)=>alert(`Handle Error - ${error}`))
    }, [])

    const change = (value:any) => {
        setValue(value)
    }
    
    return (
        <>
            <div>
                <h1>Range Component Exercise 1</h1>
                <div>
                    <Range clickOnLabel min={values.min} max={values.max} minDistance={5}  onChange={change} />
                    {value && <p>Min: €{value.min}, Max: €{value.max}</p>}
                </div>
                <button onClick={()=>router.push("/")}>home</button>
            </div>
        </>
    )
}

export default Exercise1
