import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('issue_data')
@Index(['material_no'])
@Index(['issord_no'])
export class IssueData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nchar', length: 4, nullable: true })
  section_c: string;

  @Column({ type: 'nchar', length: 4, nullable: true })
  line_c: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  issord_no: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  issord_dtl_no: string;

  @Column({ type: 'nchar', length: 26, nullable: true })
  material_no: string;

  @Column({ type: 'int', nullable: true })
  issue_qty: number;

  @Column({ type: 'int', nullable: true })
  issued_qty: number;

  @Column({ type: 'datetime', nullable: true })
  plan_dt: Date;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  data1: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  data2: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  data3: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  data4: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  data5: string;

  @Column({ type: 'nchar', length: 8, nullable: true })
  userid: string;

  @Column({ type: 'datetime', name: 'ent_dt', nullable: true })
  ent_dt: Date;

  @Column({ type: 'datetime', name: 'upd_dt', nullable: true })
  upd_dt: Date;
}
