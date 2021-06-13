//
//  NSDate+Common.h
//  FreeDaily
//
//  Created by YongbinZhang on 3/5/13.
//  Copyright (c) 2013 YongbinZhang
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

#import <Foundation/Foundation.h>

@interface NSDate (Common)

/****************************************************
 *@Description:������ݡ��·ݡ����ڡ�Сʱ��������������������NSDate
 *@Params:
 *  year:���
 *  month:�·�
 *  day:����
 *  hour:Сʱ��
 *  minute:������
 *  second:����
 *@Return:
 ****************************************************/
+ (NSDate *)dateWithYear:(NSUInteger)year
                   Month:(NSUInteger)month
                     Day:(NSUInteger)day
                    Hour:(NSUInteger)hour
                  Minute:(NSUInteger)minute
                  Second:(NSUInteger)second;

/****************************************************
 *@Description:ʵ��dateFormatter��������
 *@Params:nil
 *Return:��Ӧ��ʽ��NSDataFormatter����
 ****************************************************/
+ (NSDateFormatter *)defaultDateFormatterWithFormatYYYYMMddHHmmss;
+ (NSDateFormatter *)defaultDateFormatterWithFormatYYYYMMdd;
+ (NSDateFormatter *)defaultDateFormatterWithFormatMMddHHmm;

+ (NSDateFormatter *)defaultDateFormatterWithFormatYYYYMMddHHmmInChinese;
+ (NSDateFormatter *)defaultDateFormatterWithFormatMMddHHmmInChinese;

/**********************************************************
 *@Description:��ȡ����İ������ꡱ�����¡������ա������ܡ�����ʱ�������֡������롱��NSDateComponents
 *@Params:nil
 *@Return:����İ������ꡱ�����¡������ա������ܡ�����ʱ�������֡������롱��NSDateComponents
 ***********************************************************/
- (NSDateComponents *)componentsOfDay;


/****************************************************
 *@Description:���NSDate��Ӧ�����
 *@Params:nil
 *@Return:NSDate��Ӧ�����
 ****************************************************/
- (NSUInteger)year;

/****************************************************
 *@Description:���NSDate��Ӧ���·�
 *@Params:nil
 *@Return:NSDate��Ӧ���·�
 ****************************************************/
- (NSUInteger)month;


/****************************************************
 *@Description:���NSDate��Ӧ������
 *@Params:nil
 *@Return:NSDate��Ӧ������
 ****************************************************/
- (NSUInteger)day;


/****************************************************
 *@Description:���NSDate��Ӧ��Сʱ��
 *@Params:nil
 *@Return:NSDate��Ӧ��Сʱ��
 ****************************************************/
- (NSUInteger)hour;


/****************************************************
 *@Description:���NSDate��Ӧ�ķ�����
 *@Params:nil
 *@Return:NSDate��Ӧ�ķ�����
 ****************************************************/
- (NSUInteger)minute;


/****************************************************
 *@Description:���NSDate��Ӧ������
 *@Params:nil
 *@Return:NSDate��Ӧ������
 ****************************************************/
- (NSUInteger)second;

/****************************************************
 *@Description:���NSDate��Ӧ������
 *@Params:nil
 *@Return:NSDate��Ӧ������
 ****************************************************/
- (NSUInteger)weekday;

/******************************************
 *@Description:��ȡ�����ǵ���ĵڼ���
 *@Params:nil
 *@Return:�����ǵ���ĵڼ���
 ******************************************/
- (NSUInteger)weekOfDayInYear;

/****************************************************
 *@Description:���һ�㵱��Ĺ�����ʼʱ��
 *@Params:nil
 *@Return:һ�㵱��Ĺ�����ʼʱ��
 ****************************************************/
- (NSDate *)workBeginTime;


/****************************************************
 *@Description:���һ�㵱��Ĺ�������ʱ��
 *@Params:nil
 *@Return:һ�㵱��Ĺ�������ʱ��
 ****************************************************/
- (NSDate *)workEndTime;


/****************************************************
 *@Description:��ȡһСʱ���ʱ��
 *@Params:nil
 *@Return:һСʱ���ʱ��
 ****************************************************/
- (NSDate *)oneHourLater;


/****************************************************
 *@Description:���ĳһ������ʱ��
 *@Params:nil
 *@Return:ĳһ������ʱ��
 ****************************************************/
- (NSDate *)sameTimeOfDate;

/******************************************
 *@Description:�ж���ĳһ���Ƿ�Ϊͬһ��
 *@Params:
 *  otherDate:ĳһ��
 *@Return:YES-ͬһ�죻NO-��ͬһ��
 ******************************************/
- (BOOL)sameDayWithDate:(NSDate *)otherDate;

/******************************************
 *@Description:�ж���ĳһ���Ƿ�Ϊͬһ��
 *@Params:
 *  otherDate:ĳһ��
 *@Return:YES-ͬһ�ܣ�NO-��ͬһ��
 ******************************************/
- (BOOL)sameWeekWithDate:(NSDate *)otherDate;

/******************************************
 *@Description:�ж���ĳһ���Ƿ�Ϊͬһ��
 *@Params:
 *  otherDate:ĳһ��
 *@Return:YES-ͬһ�£�NO-��ͬһ��
 ******************************************/
- (BOOL)sameMonthWithDate:(NSDate *)otherDate;


/****************************************************
 *@Description:��ȡʱ����ַ�����ʽ
 *@Params:nil
 *@Return:ʱ����ַ�����ʽ
 ****************************************************/
- (NSString *)stringOfDateWithFormatYYYYMMddHHmmss;
- (NSString *)stringOfDateWithFormatYYYYMMdd;
- (NSString *)stringOfDateWithFormatMMddHHmm;
- (NSString *)stringOfDateWithFormatYYYYMMddHHmmInChinese;
- (NSString *)stringOfDateWithFormatMMddHHmmInChinese;


@end