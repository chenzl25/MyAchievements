type ObjectId = string;
interface LINK_owner {
  name: string;
  email: string;
}
interface LINK_group {
  _id: ObjectId;
  toReviewGroupId: ObjectId;
  name: string;
  names: string[];
}
interface LINK_class {
  _id: ObjectId;
  name: string;
  names: string[];
}
export interface Homework {
  _id: ObjectId;
  ownerId: ObjectId;
  __v: number;
  assignmentId: ObjectId;
  github: string;
  source: string;
  message: string;
  image: string;
  reviewsId: ObjectId[];
  groupRank: string;
  classRank: string;
  finalScore: string;
  finalMessage: string;
  LINK_owner: LINK_owner; //for assistant, teacher
  // {name:
  //  email:}
  LINK_group: LINK_group; //for assistant, teacher
  // {_id:
  //  name:}
  LINK_class: LINK_class; //for teacher 
  // {_id:
  //  name:}
  LINK_review: Review;  // only one. be used to check update or create review.
  // review
  LINK_assignment: LINK_assignment;
  // {name:assignmentData.name,
  //  state:assignmentData.state,
  //  from: assignmentData.from,
  //  end: assignmentData.end,
  //  link:assignmentData.link }
}
export interface Assignment {
  _id: ObjectId;
  name: string
  __v: number;
  state: string;  // future,present,end
  link: string;
  from: string;
  end: string;
  homeworksId: ObjectId[];
  classsId: ObjectId[];
  LINK_homeworks: Homework[];  //only for get to link other datas
}
export  interface Review {
  _id: ObjectId;
  __v: number;
  reviewerId: ObjectId;
  beReviewerId: ObjectId;
  homeworkId: ObjectId;
  message: string;
  score: string;
}
export  interface Group {
  _id: ObjectId;
  __v: number;
  classId: ObjectId;
  name: string;
  assistantsId: ObjectId[];
  studentsId: ObjectId[];
  toReviewGroupId: ObjectId,
  LINK_assistants: any[],  // now no usage
  LINK_students: any[],  // now no usage
  indicate: boolean; // only in the front-end run-time
}
export  interface Class {
  _id: ObjectId;
  __v: number;
  name: string;
  groupsId: ObjectId[];
  assignmentsId: ObjectId[];
  teachersId: ObjectId[];
  LINK_assignments: LINK_assignment[],  //only for get to link other datas
  LINK_teachers: any[], // now no usage
  LINK_groups: any[], // now no usage
  indicate: boolean; // only in the front-end run-time
}

export interface User {
  _id: ObjectId;
  __v: number;
  account: string;
  password: string;
  email: string;
  name: string;
  position: string;
  homeworksId: ObjectId[];
  classsId: ObjectId[];
  groupsId: ObjectId[];
  LINK_homeworks: [Homework],
  LINK_group: LINK_group;// if assistant {names:[]} else {name:string}

  LINK_class: LINK_class;// if teacher {names:[]} else {name:string}
  LINK_assignments: LINK_assignment[]; //{_id, name, link, from, end, state}
}
interface LINK_assignment {
  _id: ObjectId;
  name: string;
  from: string;
  end: string;
  state: string;
  link: string;
}