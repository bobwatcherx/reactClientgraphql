import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  gql
} from "@apollo/client";

import {useEffect,useState} from 'react'
const client = new ApolloClient({
  uri:"https://blue-surf-420149.us-east-1.aws.cloud.dgraph.io/graphql",
  cache: new InMemoryCache()
})

const GETQUERY = gql `
query MyQuery {
  querysekolah {
    id
    kelas
    nama
  }
}`

const MUTATIONS = gql `
mutation MyMutation($nama:String,$kelas:Int) {
  addsekolah(input: {kelas: $kelas, nama: $nama}) {
    numUids
  }
}

`

export default function App(){
  const [post,setPost] = useState([])

  const [nama,setNama] = useState("")
  const [kelas,setKelas] = useState("")
  
  async function getdata(){
    await client.query({query:GETQUERY}).then(res=>{
      setPost(res.data.querysekolah)
    })
  }
  async function handle(){
    await client.mutate({mutation:MUTATIONS,variables:{
      nama:nama,
      kelas:parseInt(kelas)
    }}).then(res=>console.log(res))
    .catch(err=>console.log(err))
   }

  useEffect(()=>{
    getdata()
  },[post])
  return(
    <div>
    {post.map((p,i)=>(
      <li>{p.nama} - {p.kelas} </li>
      ))}
    <h1>MUTATIONS DATA :</h1>
        kelas: <input type="number" onChange={(e)=>setKelas(e.target.value)}/>
      name :<input type="text" onChange={(e)=>setNama(e.target.value)}/>
      <button onClick={handle}>add</button>
  <br/>
    </div>)
}