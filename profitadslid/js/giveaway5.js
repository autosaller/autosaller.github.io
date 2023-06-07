$(document).on('click','.socialAuth .email',function(){$('#loginModal').modal('show');});$(document).on('click','.step',function(){if($('#emailSettingsModal').length&&!$('#emailSettingsModal').hasClass('emailFinished')){$('#emailSettingsModal').modal('show');return;}
var $entry=$(this).find('.entry');var $this=$entry.parent().parent();if($this.next().hasClass('embed')){if($this.hasClass('pending')){$this.removeClass('pending').next().slideUp().parent().removeClass('is-open');return;}
if($this.hasClass('finished')){$this.next().slideToggle();$this.parent().removeClass('is-open');if($this.next().hasClass('pending'))$this.parent().addClass('is-open');return;}}
if($this.hasClass('pending')||$this.hasClass('finished'))return;$('.entries-container .step.pending').removeClass('pending');$('.entries-container .hasEmbed + .embed').slideUp();var pid=$entry.data('pid');var sid=$entry.data('sid');var slug=$entry.data('slug');var action=$entry.data('action');var ver=$entry.data('ver');var url=$entry.data('url');var tweet=$entry.data('tweet');var profileName=$entry.data('profile');if(sid=='auth'||sid=='twitter'||sid=='twitch'||sid=='mixer'||sid=='tumblr'||sid=='discord'){var dropdownContents='';if(sid=='auth'){if(document.getElementById('giveSocials'))dropdownContents+=document.getElementById('giveSocials').outerHTML;if(document.getElementById('registerForm'))dropdownContents+=document.getElementById('registerForm').outerHTML+document.getElementById('loginForm').outerHTML;}else{$('#authModal .authType').html(sid);$('#authModal .btn').addClass('hidden');$('#authModal .'+sid).removeClass('hidden');dropdownContents=$('#authModal .modal-body').html();}
$this.addClass('pending hasEmbed').parent().addClass('is-open');if(!$this.next().hasClass('embed'))$this.after('<div class="embed socialAuth">'+dropdownContents+'</div>');$this.next().slideDown().parent().addClass('is-open');return;}
if(action=='bonus_daily'){submitEntry($this,pid,sid,slug,true);return;}
if(sid=='snapchat'||sid=='complete'||sid=='unlock')return;if(action=='viral'){$this.addClass('pending hasEmbed').parent().addClass('is-open');if(!$this.next().hasClass('embed'))$this.after('<div class="embed text-center">'+url+'</div>');$('.numViral').appendTo($this.next('.embed'));$this.next().slideDown().parent().addClass('is-open');return;}
if(action=='youtube_watch'&&url.length<15){$this.addClass('pending hasEmbed').parent().addClass('is-open');if(!$this.next().hasClass('embed')){$this.after('<div class="embed"><div id="player_'+pid+'"></div></div>');onYouTubePlayerAPIReady($this,pid,sid,slug,url);}else{$this.next().slideDown();}
return;}
if(ver){if(!$('body').hasClass('is-mobile')&&$this.hasClass('pending'))submitEntry($this,pid,sid,slug,false);$this.addClass('pending hasEmbed');var msg='View Channel';var msg2='Verify';var btnClass='twitch';var extraCode='';if(action=='discord_join'){msg='View Discord';btnClass='discord';}
if(action=='twitter_follow'){msg='Follow';btnClass='twitter';}
if(action=='twitter_retweet'||action=='twitter_tweet'){msg='Retweet';btnClass='twitter';extraCode=url;url=tweet;if(action=='twitter_retweet')url='https://twitter.com/intent/retweet?tweet_id='+url.split('/status/')[1].split('?')[0];if(action=='twitter_tweet')msg='Tweet';}
if(action=='mixer_follow'||action=='mixer_subscribe'){btnClass='mixer';}
if(action=='tumblr_follow'||action=='tumblr_like'||action=='tumblr_reblog'){btnClass='tumblr';msg='View on Tumblr';msg2='Follow & Verify';if(action=='tumblr_like')msg2='Like & Verify';if(action=='tumblr_reblog')msg2='Reblog & Verify';}
var toAppendAfter='<div class="embed text-center">'+extraCode+'<button class="btn popup '+btnClass+'" data-href="'+url+'"><i class="fab fa-'+btnClass+'"></i>'+msg+'</button><button class="btn '+btnClass+' confirm-entry"><i class="fab fa-'+btnClass+'"></i>'+msg2+'</button></div>';if($this.next('.embed').length==0)$this.after(toAppendAfter);$this.next().slideDown().parent().addClass('is-open');return;}
if(action=='email'){$this.addClass('pending hasEmbed');if($this.next('.embed').length==0)$this.after($('#email-template').html());$('.emailTOS').html(profileName);$this.next().slideDown().parent().addClass('is-open');return;}
if(action=='question'||action=='crypto'){var tmpPlace='Answer this question';if(action=='crypto')tmpPlace='Enter your address';$this.addClass('pending hasEmbed');if($this.next('.embed').length==0)$this.after('<div class="embed text-center"><input placeholder="'+tmpPlace+'" class="form-control emailPlace" type="text" name="question" /><button class="btn confirm-entry">Submit</button></div>');$this.next().slideDown().parent().addClass('is-open');return;}
if(action=='secret'||action=='secret_daily'){$this.addClass('pending hasEmbed');if($this.next('.embed').length==0)$this.after('<div class="embed text-center"><p>Have a secret code? Enter it below to gain additional entries.</p><input placeholder="Secret Code" class="form-control emailPlace" type="text" name="secret" /><button class="btn confirm-entry">Submit</button></div>');$this.next().slideDown().parent().addClass('is-open');return;}
if(url){$entry.attr('href',url);var win=window.open(url,'_blank');if(win)win.focus();}
$this.addClass('pending');submitEntry($this,pid,sid,slug,true);});$(document).on('click','.confirm-entry',function(){var $this=$(this).parent().prev();var $entry=$this.children('.two').children('.entry');var pid=$entry.data('pid');var sid=$entry.data('sid');var slug=$entry.data('slug');if($entry.data('action')=='email'){var isSubscribed=$this.next().find('.required input').is(':checked');if(!isSubscribed)return;}
submitEntry($this,pid,sid,slug,true);});function submitEntry($this,pid,sid,slug,notify){$.ajax({type:"POST",url:"/entry",data:{pid:pid,sid:sid,slug:slug,val:$this.next().find('.emailPlace').val(),fname:$this.next().find('.fnamePlace').val(),lname:$this.next().find('.lnamePlace').val(),ref:$('#ref').val(),}}).done(function(data){if(data.indexOf('Error:')!=-1||data.indexOf('invalid_grant')!=-1){$this.removeClass('pending');if($this.next().hasClass('embed'))$this.addClass('pending');if(data.indexOf('Your credentials do not allow access to this resource.')!=-1)return $('#twitterModal').modal('show');if(data.indexOf('Invalid or expired token.')!=-1)return $('#twitterModal').modal('show');if(data.indexOf('Required option not passed')!=-1)return $('#twitchModal').modal('show');if(data.indexOf('invalid_grant')!=-1)return $('#discordModal').modal('show');if(data.indexOf('invalid')!=-1)return $('#twitchModal').modal('show');if(notify)displayNotification('error',data.replace('Error:',''));}else{var data=$.parseJSON(data);setTimeout(function(){stepComplete($this);if(data.complete)stepComplete($('.step > .one.complete').parent());},data.delay);}}).fail(function(jqXHR,textStatus,errorThrown){$this.removeClass('pending');if(notify)displayNotification('error','Failed to submit entry. Please try again later. If this issue persists, please contact support.');});}
function onYouTubePlayerAPIReady($this,pid,sid,slug,videoid){window.YT.ready(function(){player=new window.YT.Player('player_'+pid,{width:'100%',height:'390',videoId:videoid,playerVars:{rel:0},events:{'onReady':function(e){$this.next().slideDown();e.target.playVideo();},'onStateChange':function(e){if(e.data===0){submitEntry($this,pid,sid,slug,true);}}}});});}
function updateProgressBar(){var progressBar=Math.ceil($('.row.step.finished').length/$('.row.step').length*100);if(progressBar>=100){if($('.row.step.finished').length==1)$('.g-cont').removeClass('g-rec');$('.g-cont').addClass('g-ended g-finished');$('#pushModal').modal('show');}
if($('.entries-container .locked').length){var isUnlocked=true;$('.entries-container > .row').each(function(){if(isUnlocked&&$(this).hasClass('locked')){$('.entries-container .locked').addClass('adone');$('.entries-container .locked .fas').removeClass('fa-lock').addClass('fa-unlock-alt');$('.entries-container .locked .entry').html('You\'ve unlocked more steps to complete!');}
if(!$(this).hasClass('finished')&&(isEmpty($(this).find('.numViral span'))||$(this).find('.numViral span').html()=='0'))isUnlocked=false;});}}
function isEmpty(el){return!$.trim(el.html());}
function stepComplete($this){$this.removeClass('pending').addClass('finished');if($this.hasClass('hasEmbed')){$this.next().slideUp(400,function(){$this.parent().removeClass('is-open');$this.removeClass('hasEmbed');$this.next().remove();});}else{$this.parent().removeClass('is-open');}
updateProgressBar();var totalEntries=$this.find('.three small span').html();var newEntries=parseInt(totalEntries)+parseInt($('#totalEntries').html());$("#totalEntries").html(newEntries);}
var countDown=$('#countdown').data('date');var countUrl=$('#countdown').data('url');if(countDown){$('#countdown').countdown({until:+countDown,compact:true,expiryUrl:countUrl});}
updateProgressBar();$(document).on('click','.showDetails',function(){$(this).parent().toggleClass('isShown');});$(document).on('click','label.required',function(){if($(this).children('input').is(':checked')){$(this).siblings('.btn').removeClass('gray disabled').attr('disabled',false);}else{$(this).siblings('.btn').addClass('gray disabled').attr('disabled',true);}});$(document).on('click','.popup',function(e){e.preventDefault();$('.popup.isActive').removeClass('isActive');$(this).addClass('isActive');$.oauthpopup({path:$(this).attr('data-href'),callback:function($url){$('.popup.isActive').removeClass('isActive');return;}});});$('#step-2').click(function(){$('body').addClass('step-2');$(document).scrollTop(0);});$('.description a').click(function(e){e.preventDefault();var url=$(this).attr('href');var win=window.open(url,'_blank');if(win)win.focus();});$(window).on('load',function(){if(navigator.cookieEnabled==false){$('.entries-container').hide();$('.thirdPartyDisabled').show();}
var featuredVideo=$('.inner .thumbnail').attr('data-video');var featuredType=$('.inner .thumbnail').attr('data-type');if(featuredType=='twitch'){$('#featuredVideo').replaceWith('<iframe class="thumbnail" id="featuredVideo" src="https://player.twitch.tv/?channel='+featuredVideo+'&parent=givelab.com&parent=manage.givelab.com" frameborder="0" allowfullscreen="true" scrolling="no" style="padding-bottom:0;background:#000;"></iframe>');}else if(featuredType=='mixer'){$('#featuredVideo').replaceWith('<iframe class="thumbnail" id="featuredVideo" src="https://mixer.com/embed/player/'+featuredVideo+'?disableLowLatency=1" frameborder="0" allowfullscreen="true" scrolling="no" style="padding-bottom:0;background:#000;"></iframe>');}else if(featuredType=='youtube'){window.YT.ready(function(){player=new window.YT.Player('featuredVideo',{width:'100%',height:'100%',videoId:featuredVideo,playerVars:{rel:0,showinfo:0,controls:0},events:{'onReady':function(e){$('.inner .thumbnail').css('padding-bottom',0).css('background','#000');},}});});}});$('#emailSettingsModal').modal('show');