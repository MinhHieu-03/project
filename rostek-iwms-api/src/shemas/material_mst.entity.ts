import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('material_mst')
@Index(['material_no'])
export class MaterialMst {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nchar', length: 26, nullable: true })
  material_no: string;

  @Column({ type: 'nchar', length: 15, nullable: true })
  material_nm: string;

  @Column({ type: 'nchar', length: 1, nullable: true })
  material_tp: string;

  @Column({ type: 'int' })
  pk_style: number;

  @Column({ type: 'int' })
  new_pk_style: number;

  @Column({ type: 'int' })
  flg: number;

  @Column({ type: 'nchar', length: 50, nullable: true })
  data1: string;

  @Column({ type: 'nchar', length: 50, nullable: true })
  data2: string;

  @Column({ type: 'nchar', length: 50, nullable: true })
  data3: string;

  @Column({ type: 'nchar', length: 50, nullable: true })
  data4: string;

  @Column({ type: 'nchar', length: 26, nullable: true })
  comment: string;

  @Column({ type: 'nchar', length: 8, nullable: true })
  user_id: string;

  @Column({ type: 'datetime', name: 'ent_dt', nullable: true })
  ent_dt: Date;

  @Column({ type: 'datetime', name: 'upd_dt', nullable: true })
  upd_dt: Date;
}
