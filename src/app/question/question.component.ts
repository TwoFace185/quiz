import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';

  public questionList: any = [];

  public currentQuestion: number = 0;

  public points: number = 0;

  counter = 60;

  correctAnswer:number=0;

  incorrectAnswer:number=0;

  intervals:any;

  progress:string="0";

  constructor(private questionService: QuestionService) {}
  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;

    this.getAllQuestion();

    this.startCounter();
  }

  getAllQuestion() {
    this.questionService.getQuestionJson().subscribe((res) => {
      console.log(res.questions);
      this.questionList = res.questions;
    });
  }

  nextQuestion() {
    this.currentQuestion++;
  }

  previousQuestion() {
    this.currentQuestion--;
  }

  answer(currentQno:number, option:any){

    if(option.correct){
    this.points+=10;
    this.correctAnswer++;
    this.currentQuestion++;
    }
    else{
      this.points-=5;
      this.incorrectAnswer++;
      this.currentQuestion++; 
    }


  }

  startCounter(){
    this.intervals=this.intervals(1000).subscribe(val=>{

      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=10;
      }

    });

    setTimeout(()=>{
      this.intervals.unsubscribe();
    },600000);

  }
  stopCounter(){

    this.intervals.unsubscribe();
    this.counter=0;

  }

  resetCounter(){

    this.stopCounter();
    this.counter=0;
    this.startCounter();
  }

  resetQuiz(){
    this.resetCounter();
    this.getAllQuestion();

    this.points=0;
    this.counter=0;

    this.currentQuestion=0;

  }

  getProgressPercent(){
    this.progress=((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  
  }

  onClick(status){

    this.stepForm=status;

  }
}
