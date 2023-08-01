// import { useEffect, useState } from 'react';
import Head from 'next/head';
import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import { Fragment } from 'react';
// const DUMMY_MEETUPS =[
//     {
//         id: 'm1',
//         title:'A First Meetup',
//         image:'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
//         address:'Some Address for First meetup',
//         description: 'This is a first meetup'
//     },
//     {
//         id: 'm2',
//         title:'A Second Meetup',
//         image:'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
//         address:'Some Address for Second meetup',
//         description: 'This is a Second meetup'
//     }   
// ];

const HomePage=(props)=>{
    // const [loadedMeetups, setLoadedMeetups] = useState([]);
    
    // useEffect(()=>{
    //     //send an http request and fetch data
    //     setLoadedMeetups( DUMMY_MEETUPS)
    // },[]);


    return(
        <Fragment>
            <Head>
                <title>Meetups </title>
                <meta name="description" content='Find the highly active developers meetup' />
            </Head>

            <MeetupList meetups={props.meetups} />

        </Fragment>
    )
}

// export const getServerSideProps=async(context)=>{
//     const req = context.req;
//     const res = context.res;
//     return {
//         props:{
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export const getStaticProps=async()=>{
    //fetch data from an API
    // const meetups = fetch('/api/meetups');
    const client = await MongoClient.connect('mongodb+srv://tester:tester47@cluster0.ravtejl.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db();
    const meetupsCollection= db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props:{
            meetups: meetups.map((meetup)=>({
                title: meetup.title,
                image: meetup.image,
                address : meetup.address,
                description: meetup.description,
                id: meetup._id.toString(),

            }))
        },
        revalidate: 1  // 1 second
    };
}

export default HomePage;