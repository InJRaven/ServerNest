import { SubjectServices } from './subject.service';
import { QuizServices } from './quiz.service';
export { SubjectServices, QuizServices };
export const PublicServices = [SubjectServices, QuizServices];
