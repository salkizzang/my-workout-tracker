import { supabase } from "@/services/supabaseClient";


export async function getServerData() {
    const { data: categories, error } = await supabase.from('categories').select('*').eq('customerId', 'init');
    console.log(categories);
    if (error) {
        console.error(error);
        return { props: { categories: [] } };
    }

    return { props: { categories } }
}


export default async function Home() {
    const data = await getServerData();
    console.log(data);
    return (
        <div>
            {data && data.props.categories.map((item: any) => {
                return (<>{item.customerId}</>)
            })}
        </div>
    )

}