import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Index } from 'typeorm';

@Entity('issue_time_schedule')
@Index(['prod_no'])
// @Index(['issord_no'])
export class IssueTimeSchedule {
  @Column({ type: 'nvarchar', length: 4, nullable: true })
  section_c: string;

  @Column({ type: 'nvarchar', length: 8, nullable: true })
  fact_c: string;

  @Column({ type: 'nvarchar', length: 8, nullable: true })
  line_c: string;

  @Column({ type: 'nvarchar', length: 18, nullable: true })
  prod_no: string;

  @Column({ type: 'nvarchar', length: 4, nullable: true })
  cusdesch_cd1: string;

  @Column({ type: 'nvarchar', length: 2, nullable: true })
  cusdesch_cd2: string;

  @Column({ type: 'nvarchar', length: 2, nullable: true })
  intdesch_cd: string;

  @PrimaryColumn({ type: 'nvarchar', length: 8, nullable: false })
  issue_ord_no: string;

  @Column({ type: 'datetime', nullable: true })
  plan_issue_dt: Date;

  @Column({ type: 'datetime', nullable: true })
  A_reqd_time: Date;

  @Column({ type: 'datetime', nullable: true })
  time_issue: Date;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  userid: string;

  @Column({ type: 'datetime', name: 'ent_dt', nullable: true })
  ent_dt: Date;

  @Column({ type: 'datetime', name: 'upd_dt', nullable: true })
  upd_dt: Date;
}
