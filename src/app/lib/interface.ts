type ObjectId = string;
export interface Homework {
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
  LINK_owner: any; //for assistant, teacher
  // {name:
  //  email:}
  LINK_group: any; //for assistant, teacher
  // {_id:
  //  name:}
  LINK_class: any; //for teacher 
  // {_id:
  //  name:}
  LINK_review: any;  // only one. be used to check update or create review.
  // review
  LINK_assignment: LINK_assignment;
  // {name:assignmentData.name,
  //  state:assignmentData.state,
  //  from: assignmentData.from,
  //  end: assignmentData.end,
  //  link:assignmentData.link }
}
export interface Assignment {
  name: string
  __v: number;
  state: string;  // future,present,end
  link: string;
  from: string;
  end: string;
  homeworksId: ObjectId[];
  classsId: ObjectId[];
  LINK_homeworks: any[];  //only for get to link other datas
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
  LINK_assistants: any[],  //only for get to link other datas
  LINK_students: any[],
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
  LINK_teachers: any[],
  LINK_groups: any[],
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
  // LINK_homeworks: [Homework],
  LINK_group: any;// if assistant {names:[]} else {name:string}

  LINK_class: any;// if teacher {names:[]} else {name:string}
  LINK_assignments: LINK_assignment[]; //{_id, name, link, from, end, state}
}
interface LINK_assignment {
  _id: string;
  name: string;
  from: string;
  end: string;
  state: string;
  link: string;
}