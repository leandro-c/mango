import React,{useState, useEffect} from 'react'
import { useRouter } from "next/navigation";
import Range from '@/components/Range/Range'
import { getExercise } from '@/services/api'
interface Props {}
interface Values {
    min: number;
    max: number;
}
interface RangeValues {
    rangeValues: []
}
function Exercise2(props: Props) {
    const {} = props

    const [values, setValues] = useState<Values>({ min: 0, max: 100 });
    const [range, setRange] = useState<RangeValues>({rangeValues:[]});

    const router = useRouter();    

    useEffect(() => {
        getExercise('exercise2').then(setRange).catch((error)=>alert(`Handle Error - ${error}`))
    }, [])

    const handlerChange = (values:Values) => {
        setValues(values)
    }
    return (
        <>
            <div>
                <h1>Range Component Exercise 2</h1>
                <div>
                    <Range rangeValues={range.rangeValues} onChange={handlerChange} />
                    {values && <p>Min: €{values.min}, Max: €{values.max}</p>}
                </div>
                <button onClick={()=>router.push("/")}>home</button>
            </div>
        </>
    )
}

export default Exercise2
