import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";
const MeetupDetails = (props) => {
  return (
    <Fragment>
    <Head>
      <title>{props.meetupData.title} </title>
      <meta
        name="description"
        content={props.meetupData.description}
      />
    </Head>
    <MeetupDetail
      image={props.meetupData.image}
      title={props.meetupData.title}
      address={props.meetupData.address}
      description={props.meetupData.description}
    />

  </Fragment>

  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://tester:tester47@cluster0.ravtejl.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  //   const selectedMeetup = await meetupsCollection.findOne({_id: meetupId})

  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  //fetch the data for single meetup
  const meetup_id = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://tester:tester47@cluster0.ravtejl.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  //const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetup_id),
  });

  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      },
    },
  };
};

export default MeetupDetails;
