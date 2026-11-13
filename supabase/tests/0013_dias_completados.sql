-- Ejecutar después de 0013, dentro de BEGIN / ROLLBACK. No deja datos de prueba.
do $$
declare u uuid:=gen_random_uuid(); other_u uuid:=gen_random_uuid(); client_u uuid:=gen_random_uuid(); r uuid:=gen_random_uuid(); d uuid:=gen_random_uuid(); d2 uuid:=gen_random_uuid(); e uuid:=gen_random_uuid(); re uuid:=gen_random_uuid();
begin
 insert into auth.users(id,email) values(u,'workout-'||u||'@example.invalid'),(other_u,'workout-'||other_u||'@example.invalid'),(client_u,'workout-'||client_u||'@example.invalid');
 update public.profiles set role='coach' where id in(u,other_u);
 insert into public.routines(id,user_id,title,type,status,weeks) values(r,u,'Prueba transaccional','personalizada','publicada',2);
 insert into public.routine_days(id,routine_id,week,position,focus) values(d,r,1,1,'Prueba'),(d2,r,2,1,'Prueba');
 insert into public.exercises(id,name,category) values(e,'Ejercicio sintético','fuerza');
 insert into public.routine_exercises(id,routine_day_id,exercise_id,position,series) values(re,d,e,1,'[{"peso":"40","reps":"10","rir":"2","descanso":"3:00"}]');
 perform set_config('equilab.test_user',u::text,true);perform set_config('equilab.other_user',other_u::text,true);perform set_config('equilab.client_user',client_u::text,true);
 perform set_config('equilab.test_day',d::text,true);perform set_config('equilab.other_day',d2::text,true);perform set_config('equilab.test_routine',r::text,true);
 perform set_config('equilab.test_payload',jsonb_build_array(jsonb_build_object('routine_exercise_id',re,'exercise_id',e,'series',jsonb_build_array(jsonb_build_object('kg','40','reps','10','rir','2','descanso','3:00'))))::text,true);
end $$;
set local role authenticated;
do $$
declare u uuid:=current_setting('equilab.test_user')::uuid; d uuid:=current_setting('equilab.test_day')::uuid; p jsonb:=current_setting('equilab.test_payload')::jsonb; first_send jsonb; corrected jsonb; n integer;
begin
 perform set_config('request.jwt.claim.sub',u::text,true);
 first_send:=public.enviar_dia_entrenamiento(d,p,null);
 assert (first_send->>'revision')::int=1,'first submission';
 begin perform public.enviar_dia_entrenamiento(d,p,null);raise exception 'duplicate accepted';exception when serialization_failure then null;end;
 corrected:=public.enviar_dia_entrenamiento(d,jsonb_set(p,'{0,series,0,kg}','"42"'),1);
 assert corrected->>'id'=first_send->>'id' and corrected->>'completed_at'=first_send->>'completed_at' and (corrected->>'revision')::int=2,'correction must keep original session/date';
 select count(*) into n from public.workout_sessions where routine_day_id=d;assert n=1,'duplicate session';
 assert (select series->0->>'kg' from public.workout_logs where session_id=(first_send->>'id')::uuid)='42','correction persisted';
 begin perform public.enviar_dia_entrenamiento(d,p,1);raise exception 'stale correction accepted';exception when serialization_failure then null;end;
 begin perform public.enviar_dia_entrenamiento(current_setting('equilab.other_day')::uuid,p,null);raise exception 'cross-day exercise accepted';exception when insufficient_privilege then null;end;
 begin perform public.enviar_dia_entrenamiento(d,jsonb_set(p,'{0,series,0,rir}','"20"'),2);raise exception 'invalid RIR accepted';exception when raise_exception then if sqlerrm<>'Invalid RIR' then raise;end if;end;
 assert (select revision from public.workout_sessions where id=(first_send->>'id')::uuid)=2,'invalid correction modified data';
 assert not has_table_privilege('authenticated','public.workout_sessions','INSERT'),'direct session insert still allowed';
 assert not has_table_privilege('authenticated','public.workout_logs','INSERT'),'direct log insert still allowed';
 perform set_config('request.jwt.claim.sub',current_setting('equilab.other_user'),true);
 begin perform public.enviar_dia_entrenamiento(d,p,2);raise exception 'other user accepted';exception when insufficient_privilege then null;end;
 perform set_config('request.jwt.claim.sub',current_setting('equilab.client_user'),true);
 begin perform public.enviar_dia_entrenamiento(d,p,null);raise exception 'inactive client accepted';exception when insufficient_privilege then null;end;
 perform set_config('request.jwt.claim.sub','',true);
 begin perform public.enviar_dia_entrenamiento(d,p,null);raise exception 'anonymous accepted';exception when insufficient_privilege then null;end;
end $$;
reset role;
do $$
begin
 begin delete from public.routine_days where id=current_setting('equilab.test_day')::uuid;raise exception 'completed day deletion accepted';exception when check_violation then null;end;
 begin update public.routines set title='Changed' where id=current_setting('equilab.test_routine')::uuid;raise exception 'completed routine rewrite accepted';exception when check_violation then null;end;
end $$;
select 'OK: envío, duplicado, corrección, fecha, versión, atomicidad, permisos y conservación de rutina' as resultado;
