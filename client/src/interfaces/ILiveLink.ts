interface ILiveLink {
  _id: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
  link: string;
  moduleId: string;
  timezone: string;
}

export default ILiveLink;
