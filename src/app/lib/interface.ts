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
  LINK_assignment: any;
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
  LINK_students: any[]
}
export  interface Class {
  _id: ObjectId;
  __v: number;
  name: string;
  groupsId: ObjectId[];
  assignmentsId: ObjectId[];
  teachersId: ObjectId[];
  LINK_assignments: any[],  //only for get to link other datas
  LINK_teachers: any[],
  LINK_groups: any[]
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
  LINK_group: any,  // 
  LINK_class: any
  LINK_assignments: any;
}